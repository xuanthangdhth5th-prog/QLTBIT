const express = require('express');
const { connectToDatabase, saveEquipment, getEquipment } = require('./sql');
const app = express()
const port = 3000

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static('../'));

connectToDatabase();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// API to get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const type = req.query.type || 'PC';
    const data = await getEquipment(type);
    res.json({ success: true, data: data });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
})

// API to save new equipment
app.post('/api/equipment', async (req, res) => {
  try {
    const { maTB, tenTB, loaiTB, nguoiDung, phongBan, trangThai, cauHinh, ngayNhap, ghiChu } = req.body;
    
    const result = await saveEquipment({
      maTB,
      tenTB,
      loaiTB,
      nguoiDung: nguoiDung || 'N/A',
      phongBan,
      trangThai: trangThai || 'Đang sử dụng',
      cauHinh: cauHinh || 'N/A',
      ngayNhap: ngayNhap || new Date().toISOString().split('T')[0],
      ghiChu: ghiChu || ''
    });
    
    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
