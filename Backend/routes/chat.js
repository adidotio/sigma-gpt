import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/geminiRes.js";
import authMiddleware from '../middlewares/authMiddleware.js'

// Test Route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "qwe",
      title: "Testing Thread",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(`ERROR - ${err}`);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all the threads
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updated_at: -1 }); // get threads in descending order
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get specific thread so the messages show up
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "Chat not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a Chat or Thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const delThread = await Thread.findOneAndDelete({ threadId });

    if (!delThread) {
      res.status(404).json({ error: "No chat to delete" });
    }

    res.status(200).json({ success: "Chat deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Routes which will take a message from the user and generate the response (MOST IMP ROUTE)
router.post("/chat", async (req, res) => {
  let { threadId, message } = req.body;

  if (!threadId || !message?.trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ roles: "user", content: message }],
      });
    } else {
      thread.messages.push({ roles: "user", content: message });
    }

    let aiReply;

    try {
      aiReply = await getGeminiResponse(message);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to generate response",
      });
    }

    thread.messages.push({ roles: "assistant", content: aiReply });
    thread.updated_at = new Date();
    await thread.save();
    res.json({ reply: aiReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
