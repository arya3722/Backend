const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const server = express();
const port = 8800;
server.use(express.json());

server.get('/all-mahasiswa', async (request, response) => {
    try {
        console.log("proses pengambilan data");
        const data = await prisma.mahasiswa.findMany();
        response.statusCode = 200
        response.json(data)
    } catch (err) {
        response.statusCode = 500
        response.json({
            message: "Server Error"
        })
    }
});

server.get("/search-mahasiswa", async (req,res) => {
    if(req.query.nama == null || req.query.tahun_akademik == null || req.query.kelas == null) {
        return res.status(400).send("Kosong")
    }
    try {
        const result = await prisma.mahasiswa.findMany({where : 
        {
            AND : {
                nama : {
                    contains : req.query.nama
                },
                tahun_akademik : req.query.tahun_akademik,
                kelas : req.query.kelas
            }
        }
        })
        return res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

server.post("/create-mahasiswa", async (request, response) => {
    
    const { nama, nim, tahun_akademik, semester_mahasiswa, nama_mk, kelas, sks_matkul, nilai_mutu, ips,ipk } = request.body
    if(nama == null || nim == null || tahun_akademik == null || semester_mahasiswa == null || nama_mk == null || kelas == null || sks_matkul == null || nilai_mutu == null || ips == null ||ipk == null ) {
        return res.status(400).send("Inputan Kosong")
    }
    try {
        const data = await prisma.mahasiswa.create({
            data: request.body
        })
        response.statusCode = 200
        response.json(data)
    } catch (err) {
        response.statusCode = 500
        response.json({
            message: "Server Error"
        })
    }
})

server.delete("/hapus-mahasiswa/:nim", async (req,res) => {
    if(req.params.nim == null) {
        return res.status(400).send("Kosong")
    }
    try {
        const result = await prisma.mahasiswa.delete({where : {nim:req.params.nim}})
        if(result == null) {
            res.status(404).send("Tidak menemukan nim")
        }
        return res.status(200).send("Data sudah terhapus")
    }catch(err) {
        console.log(err)
        return res.status(500).send("Gagal Terhapus")
    }
})

server.put("/edit-mahasiswa/:nim", async (req,res) => {
    if(req.params.nim == null) {
        return res.status(400).send("NIM tidak dimasukkan")
    }

    const { nama, nim, tahun_akademik, semester_mahasiswa, nama_mk, kelas, sks_matkul, nilai_mutu, ips,ipk } = req.body
    if(nama == null || nim == null || tahun_akademik == null || semester_mahasiswa == null || nama_mk == null || kelas == null || sks_matkul == null || nilai_mutu == null || ips == null ||ipk == null ) {
        return res.status(400).send("Inputan Kosong")
    }
    try {
        const result = await prisma.mahasiswa.update({data : req.body, where : {nim : req.params.nim}})
        if(result == null) {
            res.status(404).send("Tidak menemukan nim")
        }
        return res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }

})

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})