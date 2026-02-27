import axios from 'axios';

// will delete it after testing

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails: string;
  matches: Array<{
    translation: string;
    quality: string;
    reference: string;
    source: string;
    target: string;
  }>;
}

class TranslationServiceClass {
  private readonly MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

  /**
   * Translates text using MyMemory Translation API
   */
  async translateText(request: TranslationRequest): Promise<string> {
    if (!request.text.trim()) return '';

    try {
      const params = new URLSearchParams({
        q: request.text.trim(),
        langpair: `${request.sourceLang}|${request.targetLang}`,
        de: 'mahdacademy@admin.com' // Contact email for better rate limits
      });

      const response = await axios.get<MyMemoryResponse>(
        `${this.MYMEMORY_API_URL}?${params}`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.data.responseStatus === 200 && response.data.responseData) {
        return response.data.responseData.translatedText;
      }

      throw new Error('Translation API returned unsuccessful response');
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  /**
   * Auto-translate from English to Arabic using external API
   */
  async translateEnToAr(text: string): Promise<string> {
    if (!text.trim()) return '';
    
    try {
      return await this.translateText({
        text: text.trim(),
        sourceLang: 'en',
        targetLang: 'ar'
      });
    } catch (error) {
      console.error('EN to AR translation error:', error);
      return '';
    }
  }

  /**
   * Translate from Arabic to English (for reverse functionality if needed)
   */
  async translateArToEn(text: string): Promise<string> {
    if (!text.trim()) return '';
    
    try {
      return await this.translateText({
        text: text.trim(),
        sourceLang: 'ar',
        targetLang: 'en'
      });
    } catch (error) {
      console.error('AR to EN translation error:', error);
      return '';
    }
  }
}

export const TranslationService = new TranslationServiceClass();