#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Vercel Deployment Setup Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo -e "${RED}Vercel CLI chưa được cài đặt!${NC}"
    echo -e "${GREEN}Đang cài đặt Vercel CLI...${NC}\n"
    npm install -g vercel
fi

echo -e "${GREEN}✓ Vercel CLI đã sẵn sàng${NC}\n"

# Login to Vercel
echo -e "${BLUE}Bước 1: Đăng nhập Vercel${NC}"
vercel login

# Link project
echo -e "\n${BLUE}Bước 2: Link project với Vercel${NC}"
vercel link

# Get project info
if [ -f ".vercel/project.json" ]; then
    echo -e "\n${GREEN}✓ Project đã được link thành công!${NC}"
    echo -e "${BLUE}Thông tin project:${NC}"
    cat .vercel/project.json
    
    # Extract IDs
    ORG_ID=$(grep -o '"orgId": *"[^"]*"' .vercel/project.json | sed 's/"orgId": *"\(.*\)"/\1/')
    PROJECT_ID=$(grep -o '"projectId": *"[^"]*"' .vercel/project.json | sed 's/"projectId": *"\(.*\)"/\1/')
    
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${GREEN}Thêm các secrets sau vào GitHub:${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}VERCEL_ORG_ID:${NC} $ORG_ID"
    echo -e "${GREEN}VERCEL_PROJECT_ID:${NC} $PROJECT_ID"
    echo -e "${RED}VERCEL_TOKEN:${NC} Tạo tại https://vercel.com/account/tokens"
    echo -e "${BLUE}========================================${NC}\n"
else
    echo -e "${RED}✗ Không tìm thấy file .vercel/project.json${NC}"
    echo -e "${RED}Vui lòng chạy lại script!${NC}"
fi

echo -e "\n${GREEN}✓ Setup hoàn tất!${NC}"
echo -e "${BLUE}Bước tiếp theo:${NC}"
echo -e "1. Tạo token tại: ${GREEN}https://vercel.com/account/tokens${NC}"
echo -e "2. Thêm secrets vào GitHub: ${GREEN}https://github.com/YOUR_REPO/settings/secrets/actions${NC}"
echo -e "3. Push code lên GitHub để kích hoạt CI/CD\n"
