class EnhancedKnowledgeBase {
    constructor() {
        this.knowledge = {
            persons: {
                "رامین اجلال": {
                    name: "رامین اجلال",
                    type: "person",
                    profession: "توسعه‌دهنده نرم‌افزار و محقق هوش مصنوعی",
                    expertise: ["پردازش زبان فارسی", "هوش مصنوعی", "توسعه وب", "سیستم‌های توزیع‌شده"],
                    achievements: [
                        "توسعه سیستم نطق مصطلح - سیستم هوشمند پردازش دانش",
                        "تحقیق در زمینه پردازش زبان طبیعی فارسی",
                        "توسعه معماری‌های مقیاس‌پذیر برای سیستم‌های هوش مصنوعی",
                        "همکاری در پروژه‌های متن‌باز مربوط به هوش مصنوعی فارسی"
                    ],
                    projects: ["نطق مصطلح", "سیستم‌های پردازش زبان فارسی"],
                    background: "فعال در حوزه فناوری اطلاعات و هوش مصنوعی با تمرکز بر راه‌حل‌های بومی فارسی",
                    public_info_available: true,
                    private_info_available: false
                },
                "من": {
                    type: "user",
                    description: "کاربر سیستم نطق مصطلح"
                }
            },
            // ... بقیه کد بدون تغییر
        };

        this.responseTemplates = {
            // ... قالب‌های قبلی
            
            privacy_respect: () =>
                "🤫 این اطلاعات شخصی محسوب می‌شود و من دسترسی به آن ندارم.\n" +
                "می‌تونم در مورد جنبه‌های حرفه‌ای و تخصصی کمک کنم.",

            personal_info_redirect: (personName) =>
                `🔒 اطلاعات شخصی درباره ${personName} در دسترس نیست.\n` +
                `اما می‌تونم در مورد زمینه‌های حرفه‌ای و دستاوردهایش اطلاعات بدم.`
        };
    }

    // ... متدهای قبلی بدون تغییر

    detectTrueIntent(text, entities) {
        // اگر سوال شخصی درباره ازدواج/خانواده
        if (text.includes("همسر") || text.includes("ازدواج") || text.includes("خانواده")) {
            return "personal_life_inquiry";
        }

        // اگر نام رامین اجلال ذکر شده
        if (entities.persons.includes("رامین اجلال")) {
            if (entities.actions.includes("achievement")) {
                return "person_achievements";
            }
            if (entities.actions.includes("expertise")) {
                return "person_expertise";
            }
            if (entities.actions.includes("identity")) {
                return "person_identity";
            }
            return "person_general";
        }

        // ... بقیه منطق بدون تغییر
    }

    determineBestResponse(intent, entities) {
        const strategies = {
            personal_life_inquiry: "privacy_response",
            person_achievements: "achievement_list",
            person_expertise: "expertise_list", 
            person_identity: "person_info",
            person_general: "person_info",
            user_identity: "user_info",
            need_clarification: "clarification",
            search_request: "search_response",
            general_inquiry: "capabilities"
        };

        return strategies[intent] || "clarification";
    }

    generateResponse(analysis) {
        const { intent, entities, response_strategy } = analysis;

        // پاسخ به سوالات شخصی
        if (intent === "personal_life_inquiry") {
            return this.responseTemplates.privacy_respect();
        }

        switch (response_strategy) {
            case "privacy_response":
                return this.responseTemplates.privacy_respect();

            case "person_info":
                if (entities.persons.includes("رامین اجلال")) {
                    return this.responseTemplates.person_info(this.knowledge.persons["رامین اجلال"]);
                }
                return this.responseTemplates.unknown_person(entities.persons[0]);

            case "achievement_list":
                if (entities.persons.includes("رامین اجلال")) {
                    return this.responseTemplates.achievement_list(this.knowledge.persons["رامین اجلال"]);
                }
                return this.responseTemplates.unknown_person(entities.persons[0]);

            case "expertise_list":
                if (entities.persons.includes("رامین اجلال")) {
                    return this.responseTemplates.expertise_list(this.knowledge.persons["رامین اجلال"]);
                }
                return this.responseTemplates.unknown_person(entities.persons[0]);

            case "user_info":
                return "👤 شما کاربر گرامی سیستم نطق مصطلح هستید! من اینجام تا به سوالات شما پاسخ بدم.";

            case "clarification":
                return this.responseTemplates.clarification(analysis.original);

            case "capabilities":
                return this.responseTemplates.capabilities();

            case "search_response":
                return "🔍 در حال حاضر امکان جستجوی آنلاین ندارم، اما می‌تونم در مورد اطلاعات موجود در پایگاه دانشم کمک کنم.";

            default:
                return this.responseTemplates.greeting();
        }
    }
}

module.exports = EnhancedKnowledgeBase;
