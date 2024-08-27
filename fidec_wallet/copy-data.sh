#!/bin/bash

# Kiểm tra xem thư mục nguồn src/data tồn tại
if [ -d "src/data" ]; then
  # Tạo thư mục đích main/data nếu chưa tồn tại
  mkdir -p data

  # Sao chép tất cả nội dung từ src/data vào main/data
  cp -r src/data/* data/
else
  echo "Thư mục src/data không tồn tại."
  exit 1
fi
