const sql = require('mssql')
const sqlConfig = {
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
  server: String(process.env.SERVER),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

const connectToDatabase = async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig).then(() => {
            console.log("Connected to database successfully");
            createTable();
        })
    } catch (err) {
        console.log(err);
        // ... error checks
    }
}

const createTable = async () => {
    try {
        const request = new sql.Request();
        
        // Drop existing tables if exists
        const dropTableQuery = `
        IF EXISTS (SELECT * FROM sysobjects WHERE name='QLTB_PC' and xtype='U') DROP TABLE QLTB_PC;
        IF EXISTS (SELECT * FROM sysobjects WHERE name='QLTB_Printer' and xtype='U') DROP TABLE QLTB_Printer;
        IF EXISTS (SELECT * FROM sysobjects WHERE name='QLTB_Router' and xtype='U') DROP TABLE QLTB_Router;
        IF EXISTS (SELECT * FROM sysobjects WHERE name='QLTB_WiFi' and xtype='U') DROP TABLE QLTB_WiFi;
        IF EXISTS (SELECT * FROM sysobjects WHERE name='QLTB_Switch' and xtype='U') DROP TABLE QLTB_Switch;
        `;
        
        // Create PC/Laptop table
        const createPCTableQuery = `
        CREATE TABLE QLTB_PC (
            ID INT PRIMARY KEY IDENTITY(1,1),
            MaTB NVARCHAR(50) NOT NULL UNIQUE,
            TenTB NVARCHAR(255) NOT NULL,
            LoaiTB NVARCHAR(100),
            NguoiDung NVARCHAR(255),
            PhongBan NVARCHAR(100),
            TrangThai NVARCHAR(50),
            CauHinh NVARCHAR(500),
            NgayNhap DATETIME DEFAULT GETDATE(),
            GhiChu NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        `;
        
        // Create Printer table
        const createPrinterTableQuery = `
        CREATE TABLE QLTB_Printer (
            ID INT PRIMARY KEY IDENTITY(1,1),
            MaTB NVARCHAR(50) NOT NULL UNIQUE,
            TenTB NVARCHAR(255) NOT NULL,
            Hang NVARCHAR(100),
            Model NVARCHAR(100),
            DiaDiemDat NVARCHAR(255),
            PhongBan NVARCHAR(100),
            TrangThai NVARCHAR(50),
            GhiChu NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        `;
        
        // Create Router table
        const createRouterTableQuery = `
        CREATE TABLE QLTB_Router (
            ID INT PRIMARY KEY IDENTITY(1,1),
            MaTB NVARCHAR(50) NOT NULL UNIQUE,
            TenTB NVARCHAR(255) NOT NULL,
            Hang NVARCHAR(100),
            Model NVARCHAR(100),
            IpWan NVARCHAR(50),
            IpLan NVARCHAR(50),
            ViTriLapDat NVARCHAR(255),
            NgayLapDat DATETIME,
            TrangThai NVARCHAR(50),
            GhiChu NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        `;
        
        // Create WiFi/Access Point table
        const createWiFiTableQuery = `
        CREATE TABLE QLTB_WiFi (
            ID INT PRIMARY KEY IDENTITY(1,1),
            MaTB NVARCHAR(50) NOT NULL UNIQUE,
            SSID NVARCHAR(100),
            ThietBiAP NVARCHAR(100),
            Hang NVARCHAR(100),
            Model NVARCHAR(100),
            IpQuanLy NVARCHAR(50),
            ViTriLapDat NVARCHAR(255),
            TrangThai NVARCHAR(50),
            GhiChu NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        `;
        
        // Create Switch table
        const createSwitchTableQuery = `
        CREATE TABLE QLTB_Switch (
            ID INT PRIMARY KEY IDENTITY(1,1),
            MaTB NVARCHAR(50) NOT NULL UNIQUE,
            Hang NVARCHAR(100),
            Model NVARCHAR(100),
            IpQuanLy NVARCHAR(50),
            SoPort INT,
            SoCong INT,
            ViTriLapDat NVARCHAR(255),
            PoE NVARCHAR(50),
            TrangThai NVARCHAR(50),
            GhiChu NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        `;
        
        await request.query(dropTableQuery);
        await request.query(createPCTableQuery);
        await request.query(createPrinterTableQuery);
        await request.query(createRouterTableQuery);
        await request.query(createWiFiTableQuery);
        await request.query(createSwitchTableQuery);
        console.log("All tables created successfully");
    } catch (err) {
        console.log("Error creating tables:", err);
    }
}

const saveEquipment = async (data) => {
    try {
        const request = new sql.Request();
        
        let insertQuery = '';
        let tableType = '';
        
        // First priority: Use equipmentType sent from client (most reliable)
        if (data.equipmentType) {
            tableType = data.equipmentType;
            console.log('Equipment type from client:', tableType);
        }
        // Second priority: Check loaiTB for explicit type hint
        else if (data.loaiTB) {
            const loaiTB = data.loaiTB.toLowerCase();
            if (loaiTB.includes('pc') || loaiTB.includes('laptop') || loaiTB.includes('macbook')) {
                tableType = 'PC';
            } else if (loaiTB.includes('printer') || loaiTB.includes('máy in')) {
                tableType = 'Printer';
            } else if (loaiTB.includes('router')) {
                tableType = 'Router';
            } else if (loaiTB.includes('wifi') || loaiTB.includes('access point') || loaiTB.includes('ap')) {
                tableType = 'WiFi';
            } else if (loaiTB.includes('switch')) {
                tableType = 'Switch';
            }
            console.log('Equipment type from loaiTB:', tableType, '(loaiTB value:', loaiTB, ')');
        }
        
        // Third priority: Auto-detect table type based on provided fields if nothing matched
        if (!tableType) {
            if (data.ssid !== undefined && data.ssid !== null && data.ssid !== '') {
                tableType = 'WiFi';
            } else if (data.soPort !== undefined || data.soCong !== undefined) {
                tableType = 'Switch';
            } else if (data.ipWan !== undefined && data.ipWan !== null && data.ipWan !== '') {
                tableType = 'Router';
            } else if (data.cauHinh !== undefined && data.cauHinh !== null && data.cauHinh !== '') {
                tableType = 'PC';
            } else if (data.hang !== undefined || data.model !== undefined) {
                tableType = 'Printer';
            } else {
                tableType = 'Printer'; // Default to Printer
            }
            console.log('Equipment type auto-detected:', tableType);
        }
        
        console.log('Final equipment type:', tableType, 'MaTB:', data.maTB);
        
        if (tableType === 'PC') {
            insertQuery = `
            INSERT INTO QLTB_PC (MaTB, TenTB, LoaiTB, NguoiDung, PhongBan, TrangThai, CauHinh, NgayNhap, GhiChu)
            VALUES (@MaTB, @TenTB, @LoaiTB, @NguoiDung, @PhongBan, @TrangThai, @CauHinh, @NgayNhap, @GhiChu)
            `;
            
            request.input('MaTB', sql.NVarChar, data.maTB);
            request.input('TenTB', sql.NVarChar, data.tenTB);
            request.input('LoaiTB', sql.NVarChar, data.loaiTB || '');
            request.input('NguoiDung', sql.NVarChar, data.nguoiDung || '');
            request.input('PhongBan', sql.NVarChar, data.phongBan);
            request.input('TrangThai', sql.NVarChar, data.trangThai || 'Đang sử dụng');
            request.input('CauHinh', sql.NVarChar, data.cauHinh || '');
            request.input('NgayNhap', sql.Date, data.ngayNhap ? new Date(data.ngayNhap) : new Date());
            request.input('GhiChu', sql.NVarChar, data.ghiChu || '');
        } 
        else if (tableType === 'Printer') {
            insertQuery = `
            INSERT INTO QLTB_Printer (MaTB, TenTB, Hang, Model, DiaDiemDat, PhongBan, TrangThai, GhiChu)
            VALUES (@MaTB, @TenTB, @Hang, @Model, @DiaDiemDat, @PhongBan, @TrangThai, @GhiChu)
            `;
            
            request.input('MaTB', sql.NVarChar, data.maTB);
            request.input('TenTB', sql.NVarChar, data.tenTB);
            request.input('Hang', sql.NVarChar, data.hang || data.tenTB || '');
            request.input('Model', sql.NVarChar, data.model || '');
            request.input('DiaDiemDat', sql.NVarChar, data.diaDiemDat || data.nguoiDung || '');
            request.input('PhongBan', sql.NVarChar, data.phongBan);
            request.input('TrangThai', sql.NVarChar, data.trangThai || 'Đang sử dụng');
            request.input('GhiChu', sql.NVarChar, data.ghiChu || '');
        }
        else if (tableType === 'Router') {
            insertQuery = `
            INSERT INTO QLTB_Router (MaTB, TenTB, Hang, Model, IpWan, IpLan, ViTriLapDat, NgayLapDat, TrangThai, GhiChu)
            VALUES (@MaTB, @TenTB, @Hang, @Model, @IpWan, @IpLan, @ViTriLapDat, @NgayLapDat, @TrangThai, @GhiChu)
            `;
            
            request.input('MaTB', sql.NVarChar, data.maTB);
            request.input('TenTB', sql.NVarChar, data.tenTB);
            request.input('Hang', sql.NVarChar, data.hang || '');
            request.input('Model', sql.NVarChar, data.model || '');
            request.input('IpWan', sql.NVarChar, data.ipWan || '');
            request.input('IpLan', sql.NVarChar, data.ipLan || '');
            request.input('ViTriLapDat', sql.NVarChar, data.viTriLapDat || '');
            request.input('NgayLapDat', sql.Date, data.ngayLapDat ? new Date(data.ngayLapDat) : null);
            request.input('TrangThai', sql.NVarChar, data.trangThai || 'Đang sử dụng');
            request.input('GhiChu', sql.NVarChar, data.ghiChu || '');
        }
        else if (tableType === 'WiFi') {
            insertQuery = `
            INSERT INTO QLTB_WiFi (MaTB, SSID, ThietBiAP, Hang, Model, IpQuanLy, ViTriLapDat, TrangThai, GhiChu)
            VALUES (@MaTB, @SSID, @ThietBiAP, @Hang, @Model, @IpQuanLy, @ViTriLapDat, @TrangThai, @GhiChu)
            `;
            
            request.input('MaTB', sql.NVarChar, data.maTB);
            request.input('SSID', sql.NVarChar, data.ssid || '');
            request.input('ThietBiAP', sql.NVarChar, data.tenTB);
            request.input('Hang', sql.NVarChar, data.hang || '');
            request.input('Model', sql.NVarChar, data.model || '');
            request.input('IpQuanLy', sql.NVarChar, data.ipQuanLy || '');
            request.input('ViTriLapDat', sql.NVarChar, data.viTriLapDat || '');
            request.input('TrangThai', sql.NVarChar, data.trangThai || 'Đang sử dụng');
            request.input('GhiChu', sql.NVarChar, data.ghiChu || '');
        }
        else if (tableType === 'Switch') {
            insertQuery = `
            INSERT INTO QLTB_Switch (MaTB, Hang, Model, IpQuanLy, SoPort, SoCong, ViTriLapDat, PoE, TrangThai, GhiChu)
            VALUES (@MaTB, @Hang, @Model, @IpQuanLy, @SoPort, @SoCong, @ViTriLapDat, @PoE, @TrangThai, @GhiChu)
            `;
            
            request.input('MaTB', sql.NVarChar, data.maTB);
            request.input('Hang', sql.NVarChar, data.hang || '');
            request.input('Model', sql.NVarChar, data.model || '');
            request.input('IpQuanLy', sql.NVarChar, data.ipQuanLy || '');
            request.input('SoPort', sql.Int, parseInt(data.soPort) || 0);
            request.input('SoCong', sql.Int, parseInt(data.soCong) || 0);
            request.input('ViTriLapDat', sql.NVarChar, data.viTriLapDat || '');
            request.input('PoE', sql.NVarChar, data.poe || '');
            request.input('TrangThai', sql.NVarChar, data.trangThai || 'Đang sử dụng');
            request.input('GhiChu', sql.NVarChar, data.ghiChu || '');
        }
        
        if (insertQuery) {
            const result = await request.query(insertQuery);
            return { success: true, message: "Equipment saved successfully to " + tableType + " table" };
        }
        
        return { success: false, message: "Cannot determine equipment type" };
    } catch (err) {
        console.log("Error saving equipment:", err);
        return { success: false, message: err.message };
    }
}

const getEquipment = async (type = 'PC') => {
    try {
        const request = new sql.Request();
        let query = '';
        
        // Determine which table to query based on type
        if (type.toLowerCase().includes('pc') || type.toLowerCase().includes('laptop')) {
            query = "SELECT * FROM QLTB_PC ORDER BY ID DESC";
        } 
        else if (type.toLowerCase().includes('printer')) {
            query = "SELECT * FROM QLTB_Printer ORDER BY ID DESC";
        }
        else if (type.toLowerCase().includes('router')) {
            query = "SELECT * FROM QLTB_Router ORDER BY ID DESC";
        }
        else if (type.toLowerCase().includes('wifi') || type.toLowerCase().includes('access point')) {
            query = "SELECT * FROM QLTB_WiFi ORDER BY ID DESC";
        }
        else if (type.toLowerCase().includes('switch')) {
            query = "SELECT * FROM QLTB_Switch ORDER BY ID DESC";
        }
        else {
            query = "SELECT * FROM QLTB_PC ORDER BY ID DESC";
        }
        
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.log("Error getting equipment:", err);
        return [];
    }
}

module.exports = { connectToDatabase, sql, saveEquipment, getEquipment };