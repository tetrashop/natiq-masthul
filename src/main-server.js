import { SelfAwareAISystem } from './knowledge-boundary.js';

export default {
    async fetch(request, env, ctx) {
        const aiSystem = new SelfAwareAISystem();
        
        // فقط اجازه درخواست‌های POST
        if (request.method !== 'POST') {
            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'فقط درخواست‌های POST پذیرفته می‌شوند',
                    version: '5.0.0-reasoning'
                }), 
                { 
                    status: 405, 
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    } 
                }
            );
        }

        try {
            const { question } = await request.json();
            
            if (!question || question.trim().length === 0) {
                return new Response(
                    JSON.stringify({
                        status: 'error',
                        message: 'سوال الزامی است',
                        version: '5.0.0-reasoning'
                    }),
                    { 
                        status: 400, 
                        headers: { 
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*'
                        } 
                    }
                );
            }

            // پردازش سوال توسط سیستم هوش مصنوعی
            const result = await aiSystem.processQuestion(question.trim());
            
            // اضافه کردن timestamp و نسخه
            result.timestamp = new Date().toISOString();
            result.version = '5.0.0-reasoning';
            
            return new Response(
                JSON.stringify(result),
                { 
                    status: 200,
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*'
                    } 
                }
            );

        } catch (error) {
            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'خطا در پردازش درخواست',
                    error: error.message,
                    version: '5.0.0-reasoning'
                }),
                { 
                    status: 500, 
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*'
                    } 
                }
            );
        }
    }
};
