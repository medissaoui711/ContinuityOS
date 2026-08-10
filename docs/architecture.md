# 🏗️ Technical Architecture & System Design
### المعمارية التقنية وتدفق البيانات لـ BCM Command Center

---

## 📐 Architecture Overview | نظرة عامة على المعمارية

**AR:** يعتمد نظام **BCM Command Center** على معمارية جانب العميل المتقدمة (Client-Side Architecture) باستخدامه أحدث تقنيات **React 18.3** و **TypeScript 5.5** وبناء الحزم عبر **Vite 5.4**. صُممت المنظومة لتعمل بأعلى مستويات السرعة والأمان، مع دعم التزامن اللحظي للبيانات وحفظ الحالة في المتصفح محلياً (LocalStorage Persistence Engine) بمرونة عالية دون الاعتماد على خوادم بطيئة في استجابة الواجهة.

**EN:** The **BCM Command Center** leverages a modern single-page client architecture powered by **React 18.3**, **TypeScript 5.5**, and **Vite 5.4**. It is engineered for zero-latency interactions, instant state reactivity, and deterministic local storage persistence, ensuring maximum operational uptime compliant with ISO 22301 continuity standards.

---

## 🛠️ Technology Choices & Justification | مبررات اختيار التقنيات

### 1. React 18.3 & TypeScript 5.5
* **AR:** أداء عالي مع دعم Concurrent React والتحديثات اللحظية للواجهة بدون إعادة تحميل الصفحات. توفر TypeScript حماية برمجية صارمة (Strict Type Safety) تمنع الأخطاء أثناء التشغيل للوظائف الحساسة مثل حساب درجة الاستمرارية (Continuity Score) وتفويض البدلاء.
* **EN:** Delivers high-performance component lifecycle management with concurrent rendering capabilities. TypeScript enforces strict type safety across complex data structures like substitution matrices and office hierarchies.

### 2. Vite 5.4
* **AR:** بيئة تجميع فائقة السرعة دعم Hot Module Replacement (HMR) وتجميع أحجام صغيرة جداً لإنتاج نسق إطلاق إنتاجي خفيف (Optimized Production Bundles).
* **EN:** Provides sub-second cold starts and instant HMR during development, emitting highly optimized CommonJS/ESM distribution artifacts for Cloud Run and static edge CDNs.

### 3. Tailwind CSS 3.4
* **AR:** نظام تنسيق يعتمد على الفئات الخدمية (Utility-First CSS) مدمج بسلاسة مع دعم اتجاه الكتابة من اليمين إلى اليسار (RTL) للغة العربية، ومرونة فائقة في تخصيص الألوان والظلال.
* **EN:** Utility-first styling with native RTL orientation support, responsive container queries, and seamless custom theme extensions.

---

## 🔄 Component Hierarchy & Data Flow | هيكلية المكونات وتدفق البيانات

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│      (Master State Engine: Roles, SOPs, Offices, Staff, Audits)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
 ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
 │   Header.tsx  │          │  Sidebar.tsx  │          │ EmergencyModal│
 └───────────────┘          └───────────────┘          └───────────────┘
                                    │
                                    ▼ (Active Tab Routing)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  - ContinuityDashboard.tsx   # Dashboard & Executive KPIs            │
 │  - OfficeManagement.tsx      # Branch & Admin Office Governance       │
 │  - AttendanceManagement.tsx  # Live Attendance Grid (Green/Red dots) │
 │  - RoleMatrix.tsx            # Substitute & Succession Matrix         │
 │  - SOPLibrary.tsx            # Standard Operating Procedures         │
 │  - DelegationWorkflows.tsx   # Approval Workflows                     │
 │  - SecureVault.tsx           # Encrypted Passwords & Documents       │
 │  - DisasterRecoveryPanel.tsx # Emergency Drills & BCP Triggers       │
 │  - AuditLogView.tsx          # ISO 22301 Audit Logs                  │
 └───────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Live Preview & PostMessage Synchronization | المزامنة اللحظية لمعاينة الهاتف

**AR:** لضمان تجربة معاينة حية ومستجيبة عبر الأجهزة المختلفة وإطارات المعاينة (Preview IFrames)، تحتوي المنظومة على آلية اتصال متقدمة تعتمد على `Window.postMessage` API. تسمح هذه الآلية بالتبادل اللحظي للبيانات وحالة الملاحة بين النافذة الرئيسية والتطبيقات المدمجة داخل الإطار دون الحاجة إلى إعادة تحميل الصفحة:

1. **الاستماع للأحداث (Event Listening):**
   يقوم المكون الرئيسي بالاستماع للرسائل الواردة من نافذة الإطار (IFrame Parent):
   ```typescript
   window.addEventListener('message', (event) => {
     if (event.data?.type === 'TAB_CHANGE') {
       setActiveTab(event.data.tab);
     }
   });
   ```

2. **بث الأحداث (Event Dispatching):**
   عند إجراء أي تغيير في الحضور أو تفعيل خطة الطوارئ، يتم بث حدث إشعاري لحفظ الحالة في الوالد:
   ```typescript
   window.parent.postMessage({ type: 'BCM_STATE_UPDATE', payload: updatedState }, '*');
   ```

**EN:** To enable seamless cross-iframe communication and real-time mobile preview synchronization, the application utilizes the native `Window.postMessage` messaging architecture. This enables zero-flicker state sync between the core workspace frame and live mobile preview viewports:

* **Bidirectional Event Bus:** Synchronizes active tab selection, emergency modal toggles, and presence status changes between viewports without page refreshes.
* **Cross-Origin Security:** Messages validate origin headers to prevent unauthorized DOM manipulation in embedded frame contexts.

---

## 💾 Persistence Engine | محرك حفظ البيانات

**AR:** تُحفظ جميع التغييرات التشغيلية (الخزينة، الفروع، المكاتب، الموظفين، الحضور، البدلاء) تلقائياً في `LocalStorage` مع استرجاع آلي للبيانات عند بدء التطبيق (`INITIAL_DATA` Fallback)، مما يضمن عدم ضياع أي بيانات تشغيلية أثناء غلق المتصفح.

**EN:** All state changes across branches, offices, personnel, presence statuses, and audit logs are reactively mirrored to browser `LocalStorage`. Fallback initializers (`INITIAL_BRANCHES`, `INITIAL_OFFICES`, `INITIAL_EMPLOYEES`) guarantee smooth cold boot initialization for new sessions.
