# 🎨 Design System, Theming & Visual Identity
### الهوية البصرية، نظام الألوان، والأسلوب التصميمي للمنظومة

---

## 🏛️ Design Philosophy: Executive Modernism | فلسفة التصميم القيادي

**AR:** يعتمد نظام **BCM Command Center** على أسلوب تصميم بصر حاد ونظيف يجمع بين **الحداثة الفاخرة (Modern Executive UI)** والوضوح الميداني الفائق. صُممت كل بطاقة ولون وحاشية بعناية لتوفر للرئيس التنفيذي إحاطة فورية وراحة بصرية أثناء متابعة آلاف الموظفين والمكاتب دون إجهاد بصري.

**EN:** The **BCM Command Center** UI fuses **Modern Executive Elegance** with high-contrast functional clarity. Designed specifically for C-Level executives and Ops directors, the user interface prioritizes instant scanability, crisp spatial grid alignment, and high-visibility status indicators.

---

## 🎨 Presence Indicator Palette | نظام ألوان الحضور والغياب

**AR:** لضمان التمييز الفوري بين حالات الموظفين داخل المكاتب الإدارية، يعتمد النظام خريطة ألوان دلالية عالمية:

| Status / الحالة | Visual Indicator / المؤشر البصري | Hex & Tailwind Class | Meaning & Operational Context |
| :--- | :--- | :--- | :--- |
| **Present / حاضر** | 🟢 **Green Dot (Pulse)** | `#10B981` (`emerald-500`) | الموظف حاضر بمكتبه وتوقيعه موثق إلكترونياً. |
| **Absent / غائب** | 🔴 **Red Dot** | `#EF4444` (`rose-500`) | الموظف غائب، مع عرض البديل القائم بالعمل آلياً. |
| **Remote / عمل عن بعد**| 🔵 **Blue Dot** | `#3B82F6` (`blue-500`) | الموظف متصل ويؤدي مهامه من غرفة العمل عن بعد. |
| **On Leave / إجازة** | 🟠 **Amber Dot** | `#F59E0B` (`amber-500`) | إجازة رسمية معتمدة مع تفويض البديل بالصلاحيات. |

---

## 📐 Spatial Rhythms & Border Rules | القواعد الهندسية والمسافات

### 1. Mathematical Corner Nesting Rule
* **AR:** القاطرة الهندسية للزوايا الدائرية تعتمد القافية الرياضية:
  `Outer Corner Radius - Border Padding = Inner Corner Radius`
  * الحاوية الخارجية: `rounded-2xl` (16px)
  * الحشوة الداخلية: `p-4` (16px)
  * العناصر الداخلية: `rounded-xl` (12px)

### 2. Micro-Borders & Executive Depth
* **AR:** تجنب الظلال الضخمة الداكنة المزعجة؛ يتم الاعتماد بدلاً من ذلك على حدود دقيقة وحادة (`border border-slate-200`) مع إضاءات خلفية خفيفة جداً للبطاقات النشطة.
* **EN:** Replaces heavy, blurry drop-shadows with subtle micro-borders (`border border-slate-200`) and soft gradient overlays (`bg-slate-50`) to maintain a clean, professional aesthetic.

---

## 🔤 Typography Pairings | الخطوط والطباعة

* **Primary Font (Arabic):** Tajawal / Cairo / System Sans-Serif — خطوط رقمية واضحة ومقروءة بجودة عالية على كافة الشاشات.
* **Primary Font (English):** Inter / Plus Jakarta Sans.
* **Scale Ratio:**
  * **H1 / Display Title:** `text-xl sm:text-2xl font-bold tracking-tight text-slate-900`
  * **H2 / Section Title:** `text-base sm:text-lg font-bold text-slate-900`
  * **Body Text:** `text-xs sm:text-sm text-slate-600 leading-relaxed`
  * **Badges & Labels:** `text-[10px] sm:text-xs font-extrabold uppercase tracking-wider`

---

## 🌓 Dark & Light Contrast Principles | قواعد التباين والوضوح

* **Light Canvas:** `bg-slate-50` with pure white cards (`bg-white`).
* **Dark Contrast Headers:** `bg-slate-900` and `bg-blue-950` gradients for command center summary bars.
* **WCAG AA Compliance:** Text contrast exceeds 4.5:1 on all background variations to guarantee legibility under bright office lighting or high-glare environments.
