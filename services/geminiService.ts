import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExtractedMetadata, ProspanDocument } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for document extraction
const extractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Tiêu đề chính thức của nghiên cứu hoặc tài liệu." },
    publicationDate: { type: Type.STRING, description: "Ngày xuất bản hoặc hoàn thành nghiên cứu (YYYY-MM-DD hoặc Năm)." },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Thành phần hoạt chất được đề cập (ví dụ: EA 575)" 
    },
    mechanism: { type: Type.STRING, description: "Mô tả ngắn gọn về cơ chế tác dụng." },
    indications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các tình trạng y tế được điều trị." },
    contraindications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Khi nào KHÔNG nên sử dụng sản phẩm." },
    population: { type: Type.STRING, description: "Đối tượng mục tiêu (ví dụ: Trẻ em 6-12 tuổi, Người lớn)." },
    dosage: { type: Type.STRING, description: "Thông tin liều lượng khuyến nghị." },
    results: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các phát hiện lâm sàng chính hoặc kết quả thống kê." },
    source: { type: Type.STRING, description: "Tên tạp chí, tổ chức hoặc nguồn của tài liệu." },
    summary: { type: Type.STRING, description: "Tóm tắt ngắn gọn 2-3 câu về tài liệu." }
  },
  required: ["title", "summary"]
};

export const extractMetadata = async (text: string): Promise<ExtractedMetadata> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Phân tích văn bản y tế/sản phẩm sau về Prospan. Trích xuất các dữ liệu có cấu trúc chính xác dựa trên văn bản được cung cấp. Không bịa đặt thông tin không có. \nĐẢM BẢO KẾT QUẢ ĐẦU RA LÀ TIẾNG VIỆT.\n\nVĂN BẢN:\n${text.substring(0, 30000)}`, // Limit context if too huge
      config: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema,
        temperature: 0.1, // Low temperature for factual extraction
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as ExtractedMetadata;
  } catch (error) {
    console.error("Extraction failed:", error);
    // Return a fallback structure
    return {
      title: "Tài liệu không xác định",
      summary: "Không thể trích xuất metadata thông qua AI.",
    };
  }
};

export const semanticSearch = async (query: string, documents: ProspanDocument[]): Promise<{ answer: string, citations: string[] }> => {
  const ai = getAiClient();

  // Prepare context from documents. 
  // In a real app, this would use embeddings and a vector DB.
  // Here we concatenate summaries and titles for the context window.
  const context = documents.map(doc => 
    `ID: ${doc.id}\nTiêu đề: ${doc.metadata.title}\nNội dung tóm tắt: ${doc.metadata.summary}\nKết quả chính: ${doc.metadata.results?.join("; ")}\n---\n`
  ).join("\n");

  const prompt = `
  Bạn là trợ lý AI chuyên gia cho "Prospan Lib", một thư viện y khoa. 
  Trả lời câu hỏi của người dùng dựa trên các tài liệu ngữ cảnh được cung cấp.
  
  Câu hỏi người dùng: "${query}"

  Tài liệu ngữ cảnh:
  ${context}

  Hướng dẫn:
  1. Trả lời rõ ràng và chuyên nghiệp (giọng văn y khoa) bằng TIẾNG VIỆT.
  2. Nếu câu trả lời được tìm thấy trong một tài liệu cụ thể, hãy trích dẫn bằng cách tham chiếu đến Tiêu đề của nó.
  3. Nếu câu trả lời không có trong tài liệu, hãy nói rằng không có thông tin trong thư viện hiện tại.
  4. Trả về phản hồi ở định dạng JSON với "answer" (chuỗi) và "citations" (mảng các ID tài liệu được tìm thấy trong ngữ cảnh).
  `;

  const searchSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      answer: { type: Type.STRING },
      citations: { type: Type.ARRAY, items: { type: Type.STRING } } // We expect the AI to try and match IDs if possible, or we map titles later
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: searchSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return { answer: "Tôi không thể tạo câu trả lời.", citations: [] };
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Search failed:", error);
    return { answer: "Đã xảy ra lỗi khi tìm kiếm.", citations: [] };
  }
};