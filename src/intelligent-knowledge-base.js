class IntelligentKnowledgeBase {
    constructor() {
        this.knowledge = {
            persons: {
                "رامین اجلال": {
                    type: "person",
                    profession: "توسعه‌دهنده و محقق در حوزه هوش مصنوعی",
                    expertise: ["پردازش زبان فارسی", "هوش مصنوعی", "توسعه نرم‌افزار"],
                    projects: ["پروژه نطق مصطلح"],
                    public_info_available: true,
                    personal_info_available: false
                }
            },
            concepts: {
                "ازدواج": {
                    type: "personal_information",
                    accessibility: "private",
                    response_strategy: "privacy_respect"
                },
                "همسر": {
                    type: "family_relation", 
                    accessibility: "private",
                    response_strategy: "privacy_respect"
                }
            }
        };
        
        this.responseStrategies = {
            privacy_respect: "این اطلاعات شخصی محسوب می‌شود و من دسترسی به آن ندارم.",
            factual_response: (facts) => `بر اساس اطلاعات موجود: ${facts}`,
            clarification: "لطفاً سوال خود را دقیق‌تر بیان کنید. منظورتون رو متوجه نشدم.",
            honest_unknown: "صادقانه بگویم، اطلاعات دقیقی در این مورد ندارم.",
            redirect: "در حال حاضر می‌تونم در مورد موضوعات دیگری کمک کنم."
        };
    }

    // تحلیل عمیق سوال
    deepQuestionAnalysis(question) {
        // تصحیح غلط‌های املایی رایج
        const corrected = this.spellCheck(question);
        
        // استخراج موجودیت‌های پیشرفته
        const entities = this.advancedEntityExtraction(corrected);
        
        // تشخیص قصد واقعی کاربر
        const trueIntent = this.trueIntentDetection(corrected, entities);
        
        // بررسی سطح دانش موجود
        const knowledgeStatus = this.knowledgeAvailabilityCheck(trueIntent, entities);
        
        return {
            original_question: question,
            corrected_question: corrected,
            entities: entities,
            true_intent: trueIntent,
            knowledge_status: knowledgeStatus,
            response_strategy: this.determineResponseStrategy(trueIntent, knowledgeStatus)
        };
    }

    spellCheck(text) {
        const corrections = {
            "آیه": "آیا",
            "اوازدواج": "ازدواج", 
            "اجلالوچه": "اجلال چه",
            "می دانی": "می‌دانی",
            "نمی دانی": "نمی‌دانی"
        };
        
        let corrected = text;
        for (const [wrong, correct] of Object.entries(corrections)) {
            corrected = corrected.replace(wrong, correct);
        }
        return corrected;
    }

    advancedEntityExtraction(text) {
        const entities = {
            persons: [],
            actions: [],
            attributes: [],
            questions: []
        };

        // تشخیص نام افراد
        const personMatches = text.match(/(رامین\s+اجلال|من|تو|او)/g);
        if (personMatches) entities.persons = personMatches;

        // تشخیص اقدامات
        const actions = {
            marriage: ["ازدواج", "مجرد", "همسر", "تأهل"],
            achievement: ["دست آورد", "کار", "پروژه", "تحقیق"],
            knowledge: ["می‌دانی", "می‌شناسی", "اطلاع", "دانش"]
        };

        for (const [type, words] of Object.entries(actions)) {
            if (words.some(word => text.includes(word))) {
                entities.actions.push(type);
            }
        }

        // تشخیص صفات
        if (text.includes("دکتر") || text.includes("مهندس")) {
            entities.attributes.push("title");
        }

        // تشخیص نوع سوال
        if (text.includes("؟") || text.includes("آیا") || text.includes("چه")) {
            entities.questions.push("inquiry");
        }

        return entities;
    }

    trueIntentDetection(text, entities) {
        const lowerText = text.toLowerCase();

        // اگر درباره ازدواج/همسر سوال می‌پرسد
        if (entities.actions.includes("marriage")) {
            return "personal_life_inquiry";
        }

        // اگر درباره دستاوردها سوال می‌پرسد
        if (entities.actions.includes("achievement")) {
            return "achievement_inquiry";
        }

        // اگر درباره دانش سیستم سوال می‌پرسد
        if (entities.actions.includes("knowledge")) {
            return "system_capability_inquiry";
        }

        // اگر سوال نامشخص است
        if (lowerText.includes("نمی دانم") || lowerText.includes("چه بگو")) {
            return "confused_user";
        }

        return "general_inquiry";
    }

    knowledgeAvailabilityCheck(intent, entities) {
        switch (intent) {
            case "personal_life_inquiry":
                return {
                    available: false,
                    reason: "اطلاعات شخصی",
                    suggestion: "سوالات حرفه‌ای بپرسید"
                };

            case "achievement_inquiry":
                if (entities.persons.includes("رامین اجلال")) {
                    return {
                        available: true,
                        data: this.knowledge.persons["رامین اجلال"],
                        suggestion: "اطلاعات حرفه‌ای موجود است"
                    };
                }
                return {
                    available: false,
                    reason: "شخص نامشخص",
                    suggestion: "نام شخص را مشخص کنید"
                };

            default:
                return {
                    available: false,
                    reason: "سوال نامشخص",
                    suggestion: "سوال خود را واضح‌تر بیان کنید"
                };
        }
    }

    determineResponseStrategy(intent, knowledgeStatus) {
        if (!knowledgeStatus.available) {
            if (intent === "personal_life_inquiry") {
                return "privacy_respect";
            }
            return "honest_unknown";
        }

        if (intent === "achievement_inquiry") {
            return "factual_response";
        }

        return "clarification";
    }

    generateIntelligentResponse(analysis) {
        const { true_intent, knowledge_status, response_strategy } = analysis;

        switch (response_strategy) {
            case "privacy_respect":
                return "🤫 این اطلاعات شخصی محسوب می‌شود و من دسترسی به آن ندارم. می‌تونم در مورد جنبه‌های حرفه‌ای و تخصصی کمک کنم.";

            case "factual_response":
                const facts = this.formatKnowledge(knowledge_status.data);
                return `📊 ${facts}\n\nاگر سوال خاص‌تری دارید، بپرسید.`;

            case "honest_unknown":
                return `🤔 صادقانه بگویم، اطلاعات دقیقی در این مورد ندارم.\n${knowledge_status.suggestion}`;

            case "clarification":
                return "❓ لطفاً سوال خود را دقیق‌تر بیان کنید. منظورتون رو کامل متوجه نشدم.";

            default:
                return "💡 سوال جالبی پرسیدید! می‌توانید کمی بیشتر توضیح دهید تا بهتر کمک کنم؟";
        }
    }

    formatKnowledge(data) {
        if (data.profession && data.expertise) {
            return `${data.profession} با تخصص در ${data.expertise.join("، ")}. ${data.projects ? `در ${data.projects.join("، ")} مشارکت داشته.` : ""}`;
        }
        return "اطلاعات محدودی در دسترس است.";
    }
}

module.exports = IntelligentKnowledgeBase;
