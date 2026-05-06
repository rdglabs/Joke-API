import data from '../../data.json';

export async function onRequestGet() {
    const item = data[Math.floor(Math.random() * data.length)];

    return new Response(item, {
        headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
        },
    });
}