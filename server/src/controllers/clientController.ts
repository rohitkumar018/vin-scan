import { Request, Response } from 'express';
import Client, { IClient } from '../models/Client';

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, position, websiteUrl, email, socialMediaLinks } = req.body;
    
    const client = new Client({
      name,
      position,
      websiteUrl,
      email,
      socialMediaLinks: socialMediaLinks.split(',').map((link: string) => link.trim())
    });

    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: 'Error creating client' });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: 'Error retrieving client' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: 'Error updating client' });
  }
}; 