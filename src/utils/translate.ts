export async function translateText(text: string): Promise<any> {
    try {
        const res = fetch("http://127.0.0.1:5000/translate", {
            method: "POST",
            body: JSON.stringify({
              q: `${text}`,
              source: "en",
              target: "hi"
            }),
            headers: { "Content-Type": "application/json" }
          });
        return (await res).json();
    } catch (error) {
        console.error('Translation Error:', error);
        throw new Error('Translation failed');
    }
}
