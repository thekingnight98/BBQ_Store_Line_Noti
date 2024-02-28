import React, { useState } from "react";
import porkIcon from "../assets/pig-head-icon.png"; // Import รูปภาพหมู
import chickenIcon from "../assets/chicken-icon.png"; // Import รูปภาพไก่
import { MdOutdoorGrill } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import qrCodeImage from "../assets/Qr_PromtPay.jpg";

const BBQShop = () => {
  const [pork, setPork] = useState("");
  const [chicken, setChicken] = useState("");
  const [customerName, setCustomerName] = useState("");

  const calculateTotal = () => {
    // แปลงค่าเป็น number เมื่อทำการคำนวณ
    const porkNumber = pork ? parseInt(pork) : 0;
    const chickenNumber = chicken ? parseInt(chicken) : 0;
    return (porkNumber + chickenNumber) * 10;
  };

  const handleFocus = (event) => {
    if (event.target.value === "0") {
      event.target.value = "";
    }
  };

  const handleInputChange = (event, setter) => {
    // ตรวจสอบก่อนเซ็ตค่า เพื่อให้สามารถลบได้จนถึง empty string
    const value = event.target.value;
    setter(value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าได้กรอกชื่อลูกค้าและเลือกสินค้าอย่างน้อยหนึ่งอย่างหรือไม่
    if (!customerName.trim() || (pork === "" && chicken === "")) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อและเลือกสินค้าอย่างน้อยหนึ่งอย่าง",
      });
      return; // หยุดการดำเนินการถัดไป
    }

    const total = calculateTotal();

    const now = new Date();
    const dateStr = now.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let productDetails = `วันที่และเวลา: ${dateStr} ${timeStr}\nชื่อลูกค้า: ${customerName},\nรายการสินค้า: `;

    if (chicken && chicken !== "0") {
      productDetails += `ไก่จำนวน ${chicken} ไม้`;
    }
    if (pork && pork !== "0") {
      // หากมีการสั่งไก่และหมูทั้งคู่, เพิ่มคอมม่าและช่องว่าง
      if (chicken && chicken !== "0") {
        productDetails += " และ ";
      }
      productDetails += `หมูจำนวน ${pork} ไม้`;
    }

    productDetails += `,\nราคาทั้งหมด: ${total} บาท`;

    try {
      const response = await axios.post("http://localhost:9000/send-message", {
        customerName: customerName,
        message: productDetails,
      });
      if (response.status === 200) {
        // ใช้ SweetAlert2 แทน alert ปกติ
        Swal.fire({
          title: "สแกน QR code เพื่อชำระเงิน",
          text: "ชำระเงินสำเร็จแล้วให้ส่งรูปไปทางไลน์ร้านนะครับ",
          imageUrl: qrCodeImage,
          imageWidth: 300,
          imageHeight: 300,
          imageAlt: "QR code for payment",
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: "ปิด",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            Swal.fire({
              icon: "success",
              title: "ขอบคุณที่อุดหนุนครับ",
              text: "เราหวังว่าคุณจะพอใจกับบริการของเรา",
              confirmButtonText: "ตกลง",
            });
          }
        });
        setCustomerName("");
        setChicken("");
        setPork("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "มีบางอย่างผิดพลาดในการส่งข้อมูล!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดข้อผิดพลาดในการส่งข้อมูล!",
      });
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-200">
        ร้าน <span className="text-red-400 font-extrabold">BBQ</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-200">ชื่อลูกค้า</h2>
          <input
            type="text"
            className="border p-2 w-full mb-4 rounded-md"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="กรอกชื่อลูกค้า"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="flex items-center justify-center gap-2 font-semibold text-gray-200">
              BBQ หมู
              <img className="h-10" src={porkIcon} alt="Pork" />
            </h2>
            <input
              type="text"
              className="border p-2 w-full mt-2 rounded-md"
              value={pork}
              onChange={(e) => handleInputChange(e, setPork)}
              onFocus={handleFocus}
              placeholder="จำนวนไม้หมู"
            />
          </div>
          <div>
            <h2 className="flex items-center justify-center gap-2 font-semibold text-gray-200">
              BBQ ไก่
              <img className="h-10" src={chickenIcon} alt="Chicken" />
            </h2>
            <input
              type="text"
              className="border p-2 w-full mt-2 rounded-md"
              value={chicken}
              onChange={(e) => handleInputChange(e, setChicken)}
              onFocus={handleFocus}
              placeholder="จำนวนไม้ไก่"
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="mb-4 text-gray-200">
            ราคาทั้งหมด: {calculateTotal()} บาท
          </div>
          <button
            type="submit"
            className="bg-green-800 text-gray-200 p-2 rounded hover:duration-300 
            lg:duration-300
            lg:hover:bg-green-600 sm:hover:bg-transparent"
          >
            <div className="flex items-center justify-center gab-4 ">
              <MdOutdoorGrill className="w-4" />
              <span>สั่งสินค้า</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BBQShop;
