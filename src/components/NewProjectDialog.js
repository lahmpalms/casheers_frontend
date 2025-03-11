"use client";
import { useState, useCallback, useMemo, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Box,
  Typography,
  StepConnector,
  styled,
  Paper,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../lib/api";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from "@mui/icons-material/Close";

// Custom StepConnector style
const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 10,
  },
  [`& .${StepConnector.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#ED6D23",
    borderRadius: 1,
  },
}));

export default function NewProjectDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [uploadedEmails, setUploadedEmails] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [errors, setErrors] = useState({
    name: "",
    subject: "",
    message: "",
    emails: "",
    template: "",
  });

  const [projectData, setProjectData] = useState({
    name: "",
    message: "",
    subject: "",
    emails: "",
    googleSheetLink: "",
    template: `<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;"><img src="https://img5.pic.in.th/file/secure-sv1/Picture1ae93ae40cdd2734e.jpg" alt="" width="926" height="268"></span><span lang="EN" style="font-size: 26.0pt; line-height: 115%;"><img src="https://img2.pic.in.th/pic/Picture155db830009334f28.png" alt="" width="928" height="154"></span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;">Skip The Line</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;">For SIAM Songkran people<br style="mso-special-character: line-break;"><!-- [if !supportLineBreakNewLine]--><br style="mso-special-character: line-break;"><!--[endif]--></span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 16.0pt; line-height: 115%;">Get Your SIAM Songkran Wristband </span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 16.0pt; line-height: 115%;">Delivered to Your Home Before the Event!<br><br></span><span lang="EN">We are offering free wristband delivery directly to your home! (Shipping only within Thailand)<br><br><strong style="mso-bidi-font-weight: normal;">Simply click the link below and fill in your delivery information, and we will send your wristband to you before the event!</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">👉 <strong style="mso-bidi-font-weight: normal;">[</strong><a href="https://forms.gle/sg2HRW5Z82oUd7Rw7"><strong style="mso-bidi-font-weight: normal;"><span style="color: #1155cc;">Enter Shipping Info Here</span></strong></a><strong style="mso-bidi-font-weight: normal;">]</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">Why receive your wristband at home?</span></strong></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l0 level1 lfo2; margin: 12.0pt 0cm .0001pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN">Quick and easy. No need to stand in line at the event to pick up your wristband</span></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l0 level1 lfo2; margin: 0cm 0cm 12.0pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN">Receive your wristband in advance and be ready for the event</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">If you have any questions or need assistance, feel free to reach out to us via this email.</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">**Please complete the form by February 19, 2025.**</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">Thank you for choosing CASHEERS,<br><span style="mso-spacerun: yes;">&nbsp;</span>and we hope you have an unforgettable experience at the event!</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">เพื่อให้การเตรียมตัวสำหรับงานเทศกาลของคุณสะดวกสบายยิ่งขึ้น เรามีบริการจัดส่งริสแบนด์ถึงบ้าน ฟรี!</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">(จัดส่งในประเทศไทยเท่านั้น) </span></strong><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">เพียงคลิกที่ลิงก์ด้านล่างและกรอกข้อมูลจัดส่งของคุณ เราจะส่งริสแบนด์ถึงมือคุณก่อนวันงาน!</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">👉 <strong style="mso-bidi-font-weight: normal;">[</strong><a href="https://forms.gle/sg2HRW5Z82oUd7Rw7"><strong style="mso-bidi-font-weight: normal;"><span style="color: #1155cc;">กรอกข้อมูลจัดส่งที่นี่</span></strong></a><strong style="mso-bidi-font-weight: normal;">]</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">ทำไมถึงต้องรับริสแบนด์ที่บ้าน?</span></strong></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l1 level1 lfo1; margin: 12.0pt 0cm .0001pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">สะดวกและรวดเร็ว ไม่ต้องยืนรอต่อแถวรับริสแบนด์ที่งาน</span></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l1 level1 lfo1; margin: 0cm 0cm 12.0pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">รับริสแบนด์ล่วงหน้าและเตรียมตัวให้พร้อมสำหรับงาน</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">**กรุณากรอกรายละเอียดภายในวันที่ 19 กุมภาพันธ์ 2568**</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">ขอบคุณที่เลือกใช้บริการ CASHEERS ขอให้คุณมีประสบการณ์ที่น่าจดจำและเต็มไปด้วยความประทับใจในงานครั้งนี้!</span></strong></p>
<!-- Footer Section -->
<table style="background-color: #f97316; color: #ffffff; margin: 0; padding: 0; border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td align="center"><footer style="text-align: center; padding: 1rem 0;">
<h2 style="font-size: 0.75rem; font-weight: bold; margin-bottom: 1rem;">DOWNLOAD CASHEERS APP</h2>
<div style="margin-bottom: 1.5rem;"><a style="margin: 0 0.5rem;" href="https://apps.apple.com/th/app/casheers/id1620837410" target="_blank" rel="noopener"> <img style="height: 2rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/7vq/fe0/51o/New%20Project%20%281%29.png" alt="Download on the App Store"> </a> <a style="margin: 0 0.5rem;" href="https://play.google.com/store/apps/details?id=com.casheers.events&amp;pcampaignid=web_share&amp;pli=1" target="_blank" rel="noopener"> <img style="height: 2rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/wpc/v5t/mtl/New%20Project.png" alt="Get it on Google Play"> </a></div>
<div style="margin-bottom: 1.5rem;"><a style="margin: 0 0.5rem;" href="https://www.facebook.com/Casheers" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/t4s/43l/0vm/Facebook_Icon.png" alt="Facebook"> </a> <a style="margin: 0 0.5rem;" href="https://www.instagram.com/casheers_th?igsh=dWg5enE1cGI4NXN1" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/xp8/0mo/kn8/Instagram_Icon.png" alt="Instagram"> </a> <a style="margin: 0 0.5rem;" href="https://x.com/casheers_th" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gom/n3z/x0d/X_Icon.png" alt="Twitter"> </a> <a style="margin: 0 0.5rem;" href="https://www.tiktok.com/@casheers?_t=8obpTmGjBll&amp;_r=1" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gs4/yor/wku/Tiktok_Icon.png" alt="TikTok"> </a></div>
<p style="font-size: 0.5rem; font-weight: bold;">หากคุณมีข้อข้อติดต่อสอบถามเพิ่มเติม<br>ติดต่อเรา <a style="color: #ffffff; text-decoration: underline;" href="https://casheers.com/">https://casheers.com/</a></p>
</footer></td>
</tr>
</tbody>
</table>`,
  });

  // Steps for the Stepper.
  const steps = useMemo(
    () => ["Project Details", "Project Recipient", "Project Email Template"],
    []
  );

  // Reset function to clear all states
  const resetDialog = useCallback(() => {
    setActiveStep(0);
    setIsLoading(false);
    setIsSubmitting(false);
    setEditingRowId(null);
    setEditEmailValue("");
    setUploadedEmails([]);
    setSelectionModel([]);
    setProjectData({
      name: "",
      message: "",
      subject: "",
      emails: "",
      googleSheetLink: "",
      template: `<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;"><img src="https://img5.pic.in.th/file/secure-sv1/Picture1ae93ae40cdd2734e.jpg" alt="" width="926" height="268"></span><span lang="EN" style="font-size: 26.0pt; line-height: 115%;"><img src="https://img2.pic.in.th/pic/Picture155db830009334f28.png" alt="" width="928" height="154"></span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;">Skip The Line</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 26.0pt; line-height: 115%;">For SIAM Songkran people<br style="mso-special-character: line-break;"><!-- [if !supportLineBreakNewLine]--><br style="mso-special-character: line-break;"><!--[endif]--></span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 16.0pt; line-height: 115%;">Get Your SIAM Songkran Wristband </span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN" style="font-size: 16.0pt; line-height: 115%;">Delivered to Your Home Before the Event!<br><br></span><span lang="EN">We are offering free wristband delivery directly to your home! (Shipping only within Thailand)<br><br><strong style="mso-bidi-font-weight: normal;">Simply click the link below and fill in your delivery information, and we will send your wristband to you before the event!</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">👉 <strong style="mso-bidi-font-weight: normal;">[</strong><a href="https://forms.gle/sg2HRW5Z82oUd7Rw7"><strong style="mso-bidi-font-weight: normal;"><span style="color: #1155cc;">Enter Shipping Info Here</span></strong></a><strong style="mso-bidi-font-weight: normal;">]</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">Why receive your wristband at home?</span></strong></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l0 level1 lfo2; margin: 12.0pt 0cm .0001pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN">Quick and easy. No need to stand in line at the event to pick up your wristband</span></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l0 level1 lfo2; margin: 0cm 0cm 12.0pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN">Receive your wristband in advance and be ready for the event</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">If you have any questions or need assistance, feel free to reach out to us via this email.</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">**Please complete the form by February 19, 2025.**</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">Thank you for choosing CASHEERS,<br><span style="mso-spacerun: yes;">&nbsp;</span>and we hope you have an unforgettable experience at the event!</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">เพื่อให้การเตรียมตัวสำหรับงานเทศกาลของคุณสะดวกสบายยิ่งขึ้น เรามีบริการจัดส่งริสแบนด์ถึงบ้าน ฟรี!</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">(จัดส่งในประเทศไทยเท่านั้น) </span></strong><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">เพียงคลิกที่ลิงก์ด้านล่างและกรอกข้อมูลจัดส่งของคุณ เราจะส่งริสแบนด์ถึงมือคุณก่อนวันงาน!</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><span lang="EN">👉 <strong style="mso-bidi-font-weight: normal;">[</strong><a href="https://forms.gle/sg2HRW5Z82oUd7Rw7"><strong style="mso-bidi-font-weight: normal;"><span style="color: #1155cc;">กรอกข้อมูลจัดส่งที่นี่</span></strong></a><strong style="mso-bidi-font-weight: normal;">]</strong></span></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center; margin: 12.0pt 0cm 12.0pt 0cm;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">ทำไมถึงต้องรับริสแบนด์ที่บ้าน?</span></strong></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l1 level1 lfo1; margin: 12.0pt 0cm .0001pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">สะดวกและรวดเร็ว ไม่ต้องยืนรอต่อแถวรับริสแบนด์ที่งาน</span></p>
<p class="MsoNormal" style="text-indent: -18.0pt; mso-list: l1 level1 lfo1; margin: 0cm 0cm 12.0pt 36.0pt;"><!-- [if !supportLists]--><span style="mso-list: Ignore;">●<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">รับริสแบนด์ล่วงหน้าและเตรียมตัวให้พร้อมสำหรับงาน</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">**กรุณากรอกรายละเอียดภายในวันที่ 19 กุมภาพันธ์ 2568**</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN">&nbsp;</span></strong></p>
<p class="MsoNormal" style="text-align: center;" align="center"><strong style="mso-bidi-font-weight: normal;"><span lang="EN" style="font-family: 'Arial Unicode MS',sans-serif;">ขอบคุณที่เลือกใช้บริการ CASHEERS ขอให้คุณมีประสบการณ์ที่น่าจดจำและเต็มไปด้วยความประทับใจในงานครั้งนี้!</span></strong></p>
<!-- Footer Section -->
<table style="background-color: #f97316; color: #ffffff; margin: 0; padding: 0; border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td align="center"><footer style="text-align: center; padding: 1rem 0;">
<h2 style="font-size: 0.75rem; font-weight: bold; margin-bottom: 1rem;">DOWNLOAD CASHEERS APP</h2>
<div style="margin-bottom: 1.5rem;"><a style="margin: 0 0.5rem;" href="https://apps.apple.com/th/app/casheers/id1620837410" target="_blank" rel="noopener"> <img style="height: 2rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/7vq/fe0/51o/New%20Project%20%281%29.png" alt="Download on the App Store"> </a> <a style="margin: 0 0.5rem;" href="https://play.google.com/store/apps/details?id=com.casheers.events&amp;pcampaignid=web_share&amp;pli=1" target="_blank" rel="noopener"> <img style="height: 2rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/wpc/v5t/mtl/New%20Project.png" alt="Get it on Google Play"> </a></div>
<div style="margin-bottom: 1.5rem;"><a style="margin: 0 0.5rem;" href="https://www.facebook.com/Casheers" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/t4s/43l/0vm/Facebook_Icon.png" alt="Facebook"> </a> <a style="margin: 0 0.5rem;" href="https://www.instagram.com/casheers_th?igsh=dWg5enE1cGI4NXN1" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/xp8/0mo/kn8/Instagram_Icon.png" alt="Instagram"> </a> <a style="margin: 0 0.5rem;" href="https://x.com/casheers_th" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gom/n3z/x0d/X_Icon.png" alt="Twitter"> </a> <a style="margin: 0 0.5rem;" href="https://www.tiktok.com/@casheers?_t=8obpTmGjBll&amp;_r=1" target="_blank" rel="noopener"> <img style="height: 1.5rem;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gs4/yor/wku/Tiktok_Icon.png" alt="TikTok"> </a></div>
<p style="font-size: 0.5rem; font-weight: bold;">หากคุณมีข้อข้อติดต่อสอบถามเพิ่มเติม<br>ติดต่อเรา <a style="color: #ffffff; text-decoration: underline;" href="https://casheers.com/">https://casheers.com/</a></p>
</footer></td>
</tr>
</tbody>
</table>`,
    });
    setNotification({
      open: false,
      message: "",
      severity: "info",
    });
  }, []);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    if (isSubmitting) {
      resetDialog();
      onClose();
      return; // Prevent closing while submitting
    }
    resetDialog();
    onClose();
  }, [onClose, resetDialog, isSubmitting]);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Function: Fetch emails from Google Sheet using your API.
  const handleFetchFromGoogleSheet = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = new URLSearchParams();
      data.append("sheet_url", projectData.googleSheetLink);
      const response = await api.post(
        "/project/extract-emails-from-google-sheet",
        data.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setUploadedEmails(response.data.data);
      setErrors((prev) => ({ ...prev, emails: "" }));
    } catch (error) {
      console.error("Error fetching emails from Google Sheet", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Error fetching emails from Google Sheet",
        severity: "error",
      });
      setErrors((prev) => ({
        ...prev,
        emails: "Failed to fetch emails from Google Sheet",
      }));
    } finally {
      setIsLoading(false);
    }
  }, [projectData.googleSheetLink]);

  // DataGrid columns definition.
  const emailColumns = useMemo(() => {
    const handleEditClick = (e, params) => {
      e.stopPropagation();
      setEditingRowId(params.row.id);
      setEditEmailValue(params.row.email);
    };

    const renderEmailCell = (params) => {
      const isEditing = editingRowId === params.row.id;
      return isEditing ? (
        <TextField
          size="small"
          value={editEmailValue}
          onChange={(e) => setEditEmailValue(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-input": {
              padding: "8px 12px",
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.87)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.value}
        </Typography>
      );
    };

    const renderActionsCell = (params) => {
      const isEditing = editingRowId === params.row.id;
      return isEditing ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
              color: "white",
              minWidth: "32px",
              padding: "4px 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setUploadedEmails((prev) =>
                prev.map((item) =>
                  item.ticket_id === params.row.ticket_id
                    ? { ...item, email: editEmailValue }
                    : item
                )
              );
              setEditingRowId(null);
              setEditEmailValue("");
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#666",
              color: "#666",
              "&:hover": {
                borderColor: "#333",
                color: "#333",
              },
              minWidth: "32px",
              padding: "4px 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setEditingRowId(null);
              setEditEmailValue("");
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: "#ED6D23",
            color: "#ED6D23",
            "&:hover": {
              borderColor: "#d65a1c",
              backgroundColor: "rgba(237, 109, 35, 0.04)",
            },
            minWidth: "32px",
            padding: "4px 12px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(e, params);
          }}
        >
          Edit
        </Button>
      );
    };

    return [
      {
        field: "id",
        headerName: "#",
        width: 70,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            #
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: "Email Address",
        flex: 1,
        minWidth: 250,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Email Address
          </Typography>
        ),
        renderCell: renderEmailCell,
      },
      {
        field: "firstname",
        headerName: "First Name",
        width: 150,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            First Name
          </Typography>
        ),
      },
      {
        field: "lastname",
        headerName: "Last Name",
        width: 150,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Last Name
          </Typography>
        ),
      },
      {
        field: "ticket_id",
        headerName: "Ticket ID",
        width: 200,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Ticket ID
          </Typography>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Actions
          </Typography>
        ),
        renderCell: renderActionsCell,
      },
    ];
  }, [editingRowId, editEmailValue]);

  // Step navigation handlers.
  const handleNext = useCallback(() => {
    // Validate current step before proceeding
    let hasErrors = false;
    const newErrors = { ...errors };

    if (activeStep === 0) {
      // Validate Project Details
      if (!projectData.name.trim()) {
        newErrors.name = "Project name is required";
        hasErrors = true;
      } else {
        newErrors.name = "";
      }

      if (!projectData.subject.trim()) {
        newErrors.subject = "Subject is required";
        hasErrors = true;
      } else {
        newErrors.subject = "";
      }

      if (!projectData.message.trim()) {
        newErrors.message = "Message is required";
        hasErrors = true;
      } else {
        newErrors.message = "";
      }
    }

    if (activeStep === 1) {
      // Validate Project Recipient
      if (uploadedEmails.length === 0) {
        newErrors.emails = "Please upload emails or fetch from Google Sheet";
        hasErrors = true;
      } else if (selectionModel.length === 0) {
        newErrors.emails = "Please select at least one email";
        hasErrors = true;
      } else {
        newErrors.emails = "";
      }
    }

    if (activeStep === 2) {
      // Validate Email Template
      if (!projectData.template.trim()) {
        newErrors.template = "Email template is required";
        hasErrors = true;
      } else {
        newErrors.template = "";
      }
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, projectData, uploadedEmails, selectionModel, errors]);

  const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

  // Generic field change handler with validation
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setProjectData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // File upload handler to extract emails.
  const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/project/extract-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedEmails(response?.data?.data);
      setErrors((prev) => ({ ...prev, emails: "" }));
    } catch (err) {
      console.error("Error extracting emails:", err);
      setNotification({
        open: true,
        message:
          err.response?.data?.message || "Error extracting emails from file",
        severity: "error",
      });
      setErrors((prev) => ({
        ...prev,
        emails: "Failed to extract emails from file",
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update DataGrid rows mapping
  const rows = useMemo(
    () =>
      Array.isArray(uploadedEmails)
        ? uploadedEmails.map((item, index) => ({
            id: index + 1,
            ...item,
          }))
        : [],
    [uploadedEmails]
  );

  // Update the final submit handler to handle the new email structure
  const handleSubmit = useCallback(async () => {
    const newErrors = {};
    let hasErrors = false;

    if (!projectData.name.trim()) {
      newErrors.name = "Project name is required";
      hasErrors = true;
    }
    if (!projectData.subject.trim()) {
      newErrors.subject = "Subject is required";
      hasErrors = true;
    }
    if (!projectData.message.trim()) {
      newErrors.message = "Message is required";
      hasErrors = true;
    }
    if (selectionModel.length === 0) {
      newErrors.emails = "Please select at least one email";
      hasErrors = true;
    }
    if (!projectData.template.trim()) {
      newErrors.template = "Email template is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setNotification({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedEmails = uploadedEmails.filter((_, idx) =>
        selectionModel.includes(idx + 1)
      );

      setNotification({
        open: true,
        message: "Creating project...",
        severity: "info",
      });

      const submissionData = {
        name: projectData.name,
        message: projectData.message,
        subject: projectData.subject,
        emails: selectedEmails.map((item) => ({
          email: item.email,
          firstname: item.firstname,
          lastname: item.lastname,
          ticket_id: item.ticket_id,
          attach_url: item.attach_url,
        })),
        googleSheetLink: projectData.googleSheetLink,
        htmlTemplate: projectData.template,
      };

      const createResponse = await api.post("/project/create", submissionData);

      setNotification({
        open: true,
        message: "Project created successfully! Sending emails...",
        severity: "success",
      });

      await api.post(`/project/${createResponse.data.project_id}/send`, {});

      setNotification({
        open: true,
        message: "Emails sent successfully!",
        severity: "success",
      });

      // ✅ Stop loading and close dialog
      setIsSubmitting(false);
      setTimeout(() => {
        handleDialogClose(); // Ensure it resets the form and closes the dialog
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "An error occurred while creating the project",
        severity: "error",
      });
      setIsSubmitting(false);
    }
  }, [onClose, selectionModel, uploadedEmails, projectData, handleDialogClose]);

  // Handle editor content change
  const handleEditorChange = (content) => {
    setProjectData((prev) => ({ ...prev, template: content }));
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      handleEditorChange(content);
      handleSubmit();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          New Project
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomStepConnector />}
            sx={{
              "& .MuiStepIcon-root": { color: "#ccc" },
              "& .MuiStepIcon-root.Mui-active": { color: "#ED6D23" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#ED6D23" },
              "& .MuiStepLabel-label.Mui-active": {
                color: "#ED6D23",
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "#ED6D23",
                fontWeight: "bold",
              },
              mb: 2,
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, position: "relative" }}>
            {/* STEP 0: Project Details */}
            {activeStep === 0 && (
              <>
                <TextField
                  label="Project Name"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
                <TextField
                  label="Subject"
                  name="subject"
                  value={projectData.subject}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                />
                <TextField
                  label="Message"
                  name="message"
                  value={projectData.message}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                />
              </>
            )}

            {/* STEP 1: Project Recipient */}
            {activeStep === 1 && (
              <>
                {uploadedEmails?.length === 0 ? (
                  <>
                    <TextField
                      label="Google Sheet Link"
                      name="googleSheetLink"
                      value={projectData.googleSheetLink || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      disabled={isLoading}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleFetchFromGoogleSheet}
                        disabled={isLoading || !projectData.googleSheetLink}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Fetch Emails from Google Sheet"
                        )}
                      </Button>
                      <Typography variant="body2">or</Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#ED6D23" }}
                          />
                        ) : (
                          "Upload File"
                        )}
                        <input
                          type="file"
                          accept=".xlsx"
                          hidden
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              await handleFileUpload(file);
                            }
                          }}
                          disabled={isLoading}
                        />
                      </Button>
                    </Box>
                    {errors.emails && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errors.emails}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" component="h2">
                        Uploaded Emails
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setUploadedEmails([]);
                            setSelectionModel([]);
                            setProjectData((prev) => ({
                              ...prev,
                              googleSheetLink: "",
                            }));
                          }}
                          startIcon={
                            <span role="img" aria-label="clear">
                              🗑️
                            </span>
                          }
                        >
                          Clear Data
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#ED6D23",
                            "&:hover": { backgroundColor: "#ED6D23" },
                          }}
                          component="label"
                        >
                          Upload New File
                          <input
                            type="file"
                            accept=".xlsx"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                await handleFileUpload(file);
                              }
                            }}
                          />
                        </Button>
                      </Box>
                    </Box>
                    <Paper
                      sx={{
                        height: 400,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {isLoading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            zIndex: 1,
                          }}
                        >
                          <CircularProgress sx={{ color: "#ED6D23" }} />
                        </Box>
                      )}
                      <DataGrid
                        rows={rows}
                        columns={emailColumns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) =>
                          setSelectionModel(newSelection)
                        }
                        rowSelectionModel={selectionModel}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          "& .MuiDataGrid-row": {
                            "&:hover": {
                              backgroundColor: "rgba(237, 109, 35, 0.04)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgba(237, 109, 35, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(237, 109, 35, 0.12)",
                              },
                            },
                          },
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            borderBottom: "2px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #f0f0f0",
                            padding: "8px 16px",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            padding: "12px 16px",
                          },
                          "& .MuiCheckbox-root": {
                            color: "#ED6D23",
                            "&.Mui-checked": {
                              color: "#ED6D23",
                            },
                          },
                          "& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox":
                            {
                              width: "64px !important",
                              minWidth: "64px !important",
                              maxWidth: "64px !important",
                              paddingLeft: "16px",
                            },
                          "& .MuiDataGrid-footerContainer": {
                            borderTop: "2px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#ffffff",
                          },
                        }}
                        disableRowSelectionOnClick
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                        localeText={{
                          noRowsLabel: "No emails uploaded",
                          footerRowSelected: (count) =>
                            `${count} email${count !== 1 ? "s" : ""} selected`,
                        }}
                      />
                    </Paper>
                    {errors.emails && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errors.emails}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}

            {/* STEP 2: Project Email Template */}
            {activeStep === 2 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Email Template
                </Typography>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={projectData.template}
                  onEditorChange={(content) => {
                    handleEditorChange(content);
                    setErrors((prev) => ({ ...prev, template: "" }));
                  }}
                  init={{
                    height: 400,
                    width: "100%",
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    forced_root_block: "p",
                    paste_as_text: false,
                  }}
                />
                {errors.template && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {errors.template}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body1" color="white">
            {isSubmitting ? "Processing..." : ""}
          </Typography>
        </Box>
      </Backdrop>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
