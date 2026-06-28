const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../config/db');

const router = express.Router();

// Add a comment to a post (protected)
router.post('/:postId', auth, async (req, res) => {
  const { content } = req.body;
  const postId = parseInt(req.params.postId);

  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user.userId
      },
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a comment (protected, only author)
router.delete('/:id', auth, async (req, res) => {
  const commentId = parseInt(req.params.id);

  if (isNaN(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.json({ message: 'Comment removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
