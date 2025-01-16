export async function summariser(data: string): Promise<string> {
    try {
        const cleanedInput = data
            .replace(/<[^>]*>/g, '') 
            .replace(/```[\s\S]*?```/g, '') 
            .replace(/`[^`]*`/g, '') 
            .replace(/https?:\/\/\S+/g, '') 
            .replace(/[^\x00-\x7F]+/g, '') 
            .replace(/\s+/g, ' ') 
            .trim()
            .slice(0, 1500); 

        const response = await fetch(
            `${process.env.SUMMARISATION_URL}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SUMMARISATION_HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: cleanedInput,
                })
            }
        );

        if (!response.ok) {
            console.error('HF API Error Status:', response.status);
            console.error('HF API Error Text:', response.statusText);
            const errorText = await response.text();
            console.error('HF API Error Body:', errorText);
            throw new Error(`Hugging Face API returned an error: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (Array.isArray(result)) {
            return result[0].summary_text;
        }
        return result.summary_text || 'No summary available';
    } catch (error) {
        console.error('Summariser error:', error);
        throw error;
    }
}