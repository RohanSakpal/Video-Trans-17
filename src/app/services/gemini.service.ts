import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private generativeAI: GoogleGenerativeAI;
  private messageHistory: BehaviorSubject<any> = new BehaviorSubject(null);
  generationConfig = {
    temperature: 1,
    top_p: 1,
    top_k: 32,
    // max_output_tokens: 1024,
};

safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
];
  constructor() { 
    this.generativeAI = new GoogleGenerativeAI('AIzaSyBK9jez2EI6_ABsXNopDzs6OYqEGXNVGdY');
  }

  async generateText(prompt:string) {
    const model = this.generativeAI.getGenerativeModel({model:'gemini-pro',generationConfig: this.generationConfig});

    this.messageHistory.next({
      from: 'user',
      message: prompt
    })

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    this.messageHistory.next({
      from: 'bot',
      message: text
    })
  }

  public getMessageHistory(): Observable<any> {
    return this.messageHistory.asObservable();
  }
}
