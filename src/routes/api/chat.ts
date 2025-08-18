import express, { Request, Response } from 'express';

const router = express.Router();

// @route   POST /api/chat
// @desc    AI Chat with OpenAI GPT
// @access  Public
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // OpenAI API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful e-commerce assistant for FindAll Sourcing, an online store in Cameroon. 
            You help customers with:
            - Product inquiries and recommendations
            - Pricing and availability questions
            - Delivery information (1-3 days in major cities, free delivery above 50,000 XAF)
            - Payment methods (Mobile Money MTN/Orange, bank transfer, cash on delivery)
            - WhatsApp contact: +237 678 830 036
            - Business hours and support
            Keep responses helpful, friendly, and concise. Always mention WhatsApp for complex issues.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await openaiResponse.json();
    const reply = data.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now. Please contact us via WhatsApp at +237 678 830 036.';

    res.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    const fallbackResponse = 'I\'m here to help! For immediate assistance, please contact us via WhatsApp at +237 678 830 036.';
    res.json({ reply: fallbackResponse });
  }
});

export { router };