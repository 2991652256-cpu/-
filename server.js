const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 表单提交接口
app.post('/submit', (req, res) => {
  const newData = req.body;
  // 注意：Vercel 是无状态的，重启后 data.json 会重置
  // 如果需要永久保存数据，后面可以教你用在线数据库
  const filePath = path.join(__dirname, 'data.json');

  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    let allData = [];
    if (!err && fileContent) {
      try { allData = JSON.parse(fileContent); }
      catch (e) { allData = []; }
    }

    allData.push({
      ...newData,
      submitTime: new Date().toLocaleString('zh-CN')
    });

    fs.writeFile(filePath, JSON.stringify(allData, null, 2), (err) => {
      if (err) return res.status(500).json({ message: '保存失败' });
      res.json({ message: '预约提交成功！' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`服务运行在端口 ${PORT}`);
});