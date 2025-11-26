class KnowledgeBoundary {
    constructor() {
        this.boundaries = {
            ethical: "سیستم بر اساس اخلاق اسلامی-ایرانی عمل می‌کند",
            technical: "محدود به دانش برنامه‌نویسی و فلسفه",
            temporal: "دانش تا پایان سال 2024"
        };
    }

    validateQuestion(question) {
        const restrictedTopics = ['سیاسی', 'خشونت', 'غیراخلاقی'];
        for (const topic of restrictedTopics) {
            if (question.includes(topic)) {
                return { valid: false, reason: `موضوع ${topic} خارج از محدوده است` };
            }
        }
        return { valid: true, reason: "سوال قابل پردازش است" };
    }

    getSystemCapabilities() {
        return {
            wisdom: "تولید حکمت و راهنمایی",
            productivity: "مشاوره بهره‌وری", 
            ethical: "راهنمایی اخلاقی",
            balance: "مشاوره تعادل زندگی"
        };
    }
}

// استفاده از export default برای رفع خطا
export default KnowledgeBoundary;
