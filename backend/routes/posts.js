const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts (public, with optional search and category filters)
router.get('/', async (req, res) => {
  const { search, category } = req.query;

  const where = {};
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } }
    ];
  }

  if (category && category !== 'All') {
    where.category = category;
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { comments: true, likes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: { select: { id: true, username: true } },
        comments: {
          include: { author: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'asc' }
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true } }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a post (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        authorId: req.user.userId
      },
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a post (protected, only author)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { title, content, category } = req.body;
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const data = { title, content, category };
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data,
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post (protected, only author)
router.delete('/:id', auth, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle Like (protected)
router.post('/:id/like', auth, async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.json({ message: 'Unliked' });
    } else {
      await prisma.like.create({
        data: { userId, postId }
      });
      res.json({ message: 'Liked' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
