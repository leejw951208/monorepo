## 📋 요구사항

- Node.js 22.16.0 이상
- PostgreSQL 15.0 이상

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd monorepo
```

### 2. 의존성 설치

```bash
yarn install
```

### 3. prisma 마이그레이션

```bash
yarn db:migrate
```

### 4. 애플리케이션 실행

```bash
# app = api | admin
yarn start:local {app}
```
