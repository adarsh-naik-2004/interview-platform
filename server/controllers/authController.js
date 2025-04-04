import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
      
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

export const checkAuth = async (req, res) => {
    try {
      // User is attached by authMiddleware
      res.json(req.user); 
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };