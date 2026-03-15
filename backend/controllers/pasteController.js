const Paste = require('../models/Paste');

const createPaste = async (req, res) => {
  try {
    const { title, content, tags, isPublic, expiresAt } = req.body;

    const paste = await Paste.create({
      title,
      content,
      tags: tags || [],
      isPublic: isPublic || false,
      userId: req.user._id,
      expiresAt: expiresAt || null,
    });

    res.status(201).json(paste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPastes = async (req, res) => {
  try {
    const { search, tag, favorites } = req.query;

    let query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (favorites === 'true') {
      query.isFavorite = true;
    }

    query.$or = query.$or || [];
    const pastes = await Paste.find(query).sort({ createdAt: -1 });

    const filteredPastes = pastes.filter((p) => {
      if (!p.expiresAt) return true;
      return new Date(p.expiresAt) > new Date();
    });

    res.json(filteredPastes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPasteById = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id).populate('userId', 'name');

    if (!paste) {
      return res.status(404).json({ message: 'Paste not found' });
    }

    // Check expiry
    if (paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'This paste has expired' });
    }

    // If paste is private, only owner can view
    if (!paste.isPublic) {
      if (!req.user || paste.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'This paste is private' });
      }
    }

    res.json(paste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaste = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    if (!paste) {
      return res.status(404).json({ message: 'Paste not found' });
    }

    if (paste.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this paste' });
    }

    const { title, content, tags, isPublic, expiresAt } = req.body;

    paste.title = title !== undefined ? title : paste.title;
    paste.content = content !== undefined ? content : paste.content;
    paste.tags = tags !== undefined ? tags : paste.tags;
    paste.isPublic = isPublic !== undefined ? isPublic : paste.isPublic;
    paste.expiresAt = expiresAt !== undefined ? expiresAt : paste.expiresAt;

    await paste.save();
    res.json(paste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePaste = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    if (!paste) {
      return res.status(404).json({ message: 'Paste not found' });
    }

    if (paste.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this paste' });
    }

    await paste.deleteOne();
    res.json({ message: 'Paste deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    if (!paste) {
      return res.status(404).json({ message: 'Paste not found' });
    }

    if (paste.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    paste.isFavorite = !paste.isFavorite;
    await paste.save();
    res.json({ isFavorite: paste.isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicPastes = async (req, res) => {
  try {
    const { search, tag } = req.query;

    let query = { isPublic: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const pastes = await Paste.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    const filtered = pastes.filter((p) => {
      if (!p.expiresAt) return true;
      return new Date(p.expiresAt) > new Date();
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaste,
  getAllPastes,
  getPasteById,
  updatePaste,
  deletePaste,
  toggleFavorite,
  getPublicPastes,
};
