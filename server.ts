import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client lazily or safely on server
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini Endpoint: Generate or Evaluate SOPs according to ISO 22301
app.post('/api/gemini/sop-assistant', async (req, res) => {
  try {
    const { processName, department, currentSteps, actionType } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        error: 'لم يتم إعداد مفتاح GEMINI_API_KEY في النظام.',
      });
    }

    let prompt = '';
    if (actionType === 'generate') {
      prompt = `أنت خبير في إدارة استمرارية الأعمال وفق إطار ISO 22301 ونظام تشغيل الشركات.
قم بكتابة دليل إجراء تشغيلي قياسي (SOP) تفصيلي باللغة العربية للعملية التالية:
اسم العملية: "${processName}"
القسم: "${department}"
الملاحظات أو الخطوات الحالية (إن وجدت): "${currentSteps || 'عملية نموذجية لم تحدد أبعادها بعد'}"

أرجو تقديم النتيجة بصيغة JSON بالتنسيق التالي حصراً:
{
  "title": "اسم العملية الموثق",
  "category": "قسم العملية",
  "trigger": "متى تبدأ العملية؟ (المحفز والمدخلات)",
  "ownerRole": "الدور المالك للعملية",
  "substituteRole": "الدور البديل المباشر عند الغياب",
  "inputs": ["مدخل 1", "مدخل 2"],
  "outputs": ["مخرج 1", "مخرج 2"],
  "steps": [
    {"stepNumber": 1, "title": "عنوان الخطوة", "description": "شرح بالتفصيل", "approver": "الجهة الموافقة إن وجدت"},
    {"stepNumber": 2, "title": "عنوان الخطوة", "description": "شرح بالتفصيل", "approver": "الجهة الموافقة إن وجدت"}
  ],
  "contingencyPlan": "ماذا يحدث بالتفصيل إذا غاب المسؤول المالك وما خطة البديل؟",
  "documentStorage": "أين تحفظ المستندات الناتجة وسجلات التدقيق؟",
  "completionCriteria": "كيف نتحقق ونضمن أن العملية اكتملت بنجاح وقابلة للقياس؟"
}`;
    } else {
      prompt = `أنت مدقق استمرارية أعمال معتمد ISO 22301.
قم بتقديم تحليل فجوات وتقييم مخاطر الغياب لدليل الإجراء التالي:
اسم العملية: "${processName}"
القسم: "${department}"
الخطوات المكتوبة: "${JSON.stringify(currentSteps)}"

قدم الإجابة بصيغة JSON بالعربية:
{
  "score": 85, (من 100)
  "gaps": ["فجوة 1", "فجوة 2"],
  "singlePointOfFailure": "تحليل ما إذا كان هناك اعتماد أحادي على شخص واحد",
  "recommendations": ["توصية 1", "توصية 2"],
  "bcpAdvice": "نصيحة ISO 22301 لضمان التشغيل المستمر بدون توقف"
}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text;
    const parsed = JSON.parse(resultText || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini SOP error:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي',
      details: error?.message || String(error),
    });
  }
});

// Gemini Endpoint: Drill & Continuity Risk Simulator (NIST / ISO 22301)
app.post('/api/gemini/drill-evaluator', async (req, res) => {
  try {
    const { drillScenario, rolesCovered, outcomes, blockers } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        error: 'لم يتم إعداد مفتاح GEMINI_API_KEY في النظام.',
      });
    }

    const prompt = `أنت استشاري استمرارية الأعمال وإدارة الكوارث والمخاطر وفق معايير NIST و ISO 22301.
قم بتقييم نتائج محاكاة الاختبار المفاجئ للشركة (Surprise Continuity Drill):
سيناريو الاختبار: "${drillScenario}"
الأدوار والبدلاء المشاركون: "${JSON.stringify(rolesCovered)}"
ما حدث ونتائج التشغيل: "${outcomes}"
التحديات والانقطاعات المخترقة: "${blockers || 'لا يوجد'}"

أخرج النتيجة بصيغة JSON تحتوي على:
{
  "readinessScore": 78,
  "passed": true/false,
  "keyStrengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "criticalVulnerabilities": ["ثغرة 1", "ثغرة 2"],
  "actionPlan": [
    {"action": "إجراء تصحيحي", "priority": "عالٍ/متوسط/منخفض", "responsibleRole": "اسم الدور الموكل"}
  ],
  "nistComplianceNotes": "ملاحظات الامتثال لمعايير NIST و ISO 22301"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Drill evaluation error:', error);
    return res.status(500).json({
      error: 'فشل تقييم الاختبار عبر الذكاء الاصطناعي',
      details: error?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ContinuityOS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
