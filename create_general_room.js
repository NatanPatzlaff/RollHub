
import fs from 'fs';
import path from 'path';

const API_KEY = 'UYwp8EVOJv3VikKGKZ0qd1uuliEHOisyUfskKe3Y45c36601';

async function createRoom() {
  console.log('Creating dddice room...');
  try {
    const response = await fetch('https://api.dddice.com/api/1.0/room', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'General Room - RollHub'
      })
    });

    const data = await response.json();
    if (data.data && data.data.slug) {
      const slug = data.data.slug;
      console.log('Room created successfully! Slug:', slug);
      
      const envPath = path.resolve('.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (envContent.includes('VITE_DDDICE_ROOM_SLUG=')) {
        envContent = envContent.replace(/VITE_DDDICE_ROOM_SLUG=.*/, `VITE_DDDICE_ROOM_SLUG=${slug}`);
      } else {
        envContent += `\nVITE_DDDICE_ROOM_SLUG=${slug}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('Updated .env with VITE_DDDICE_ROOM_SLUG');
    } else {
      console.error('Failed to create room:', data);
    }
  } catch (error) {
    console.error('Error during room creation:', error);
  }
}

createRoom();
