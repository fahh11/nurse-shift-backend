# 🏥 Nurse Shift Backend

Backend API สำหรับระบบจัดการตารางเวรพยาบาล (Nurse Shift Management System)

ระบบนี้ถูกออกแบบเพื่อช่วยโรงพยาบาลในการจัดการตารางเวรพยาบาล การขอแลกเวร
การอนุมัติ และการแจ้งเตือนผ่าน LINE Official Account โดย ระบบรองรับการทำงานแบบ Software as a Service (SaaS) และสามารถให้หลายหน่วยงานหรือหลายแผนกใช้งานร่วมกันผ่านระบบ Cloud ได้อย่างยืดหยุ่นและปลอดภัย

---

## ✨ Features
- 👩‍⚕️ จัดการข้อมูลพยาบาลการสร้างบัญชีและแก้ไขบัญชี
- 🏥 ระบบจัดการ Ward
- 🗓️ ระบบจัดตารางเวร (Shift Assignment)
- 🔄 การขอแลกเวรและการอนุมัติ (Shift Swap)
- 🔔 แจ้งเตือนผ่าน LINE OA
- 📊 Export Excel Report

---

## 🛠 Tech Stack
- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- pnpm
- LINE Messaging API (LINE Developer)
---

## 🧱 Architecture
```
src/
│
├── config/                     
├── docs/                     
│
├── domain/                     
│   ├── entities/               
│   ├── ports/                  
│   └── repositories/           
│
├── enums/                      
├── generated/
│   └── prisma/                 
│
├── helpers/                    
├── hooks/                      
│
├── infrastructure/             
│   ├── http/                   
│   ├── line/                   
│   └── persistence/
│       └── prisma/
│           └── repositories/   
│
├── interfaces/                 
│   ├── dto/                   
│   └── http/
│        └── controllers/   
│        └── routes/    
│        └── server.ts              
│
├── lib/                        
├── types/                      
├── use-cases/                  #
│
└── app.ts                     
```

## 🚀 Getting Started

### 1. Clone project
```bash
git clone https://github.com/fahh11/nurse-shift-backend.git

cd nurse-shift-backend
```
### 2. Install
```
pnpm install
```

### 3. สร้างไฟล์ .env
```
cp .env.example .env

```
### 4. Database Setup

```
pnpm prisma generate

pnpm prisma migrate dev

pnpm seed
```

### 5. Run
```
pnpm pun dev
```

## 🔔 LINE OA Integration

### ระบบนี้รองรับการแจ้งเตือนผ่าน LINE Official Account
- การแจ้งเตือนคำขอแลกเวร
- การแจ้งแจ้งผลการอนุมัติคำขอแลกเวร

### การตั้งค่า webhook URL ใน LINE Developer Console
https://yvone-uncalculated-durably.ngrok-free.dev/api/line/webhook

### Link เกี่ยวกับการดูแลระบบ LINE OA ของระบบ

- LINE OA Manager: https://manager.line.biz/account/@541nhvwk

- LINE Developer: https://developers.line.biz/console/channel/2009317913

