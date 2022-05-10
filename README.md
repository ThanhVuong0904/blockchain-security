# Private state variables

## EVM

Chuẩn bị rất nhiều slot trong EVM

`1 slot = 32 byte`

Giá trị mặc định slot khi khởi tạo = 0

image.png

Contract Ownable đã lưu biến `_owner` ở Storage 0

Nên biến `_password ` sẽ lưu Storage 1
