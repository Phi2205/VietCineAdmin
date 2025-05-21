import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Avatar,
    Chip,
    Stack,
    Card,
    Fade,
    createTheme,
    ThemeProvider,
    CardMedia,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { CloudUpload, Close } from "@mui/icons-material";
import { Tv } from "lucide-react";
import {
    Add,
    Edit,
    Delete,
    Search,
    VideoSettings,
    LocationOn,
    EventSeat,
    Movie,
    Theaters
} from '@mui/icons-material';
import AddIcon from "@mui/icons-material/Add";
// Cinema-inspired dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff5252',
        },
        secondary: {
            main: '#ff9100',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
});
// const theaterBrands = [
//     {
//         id: 1,
//         name: "CGV",
//         logo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEBUSDw8SEBUQExUVEBAVFRIREBYQFRIWFhYUExYYHSggGBslHhUTIjEhJSkrLy46FyA/ODU4NzQtLisBCgoKDg0OGxAQGy0mICY1LTA2Li0tLTAwLS8tNSswLS0tLy0tNS0tLSsvLS0tLy8tLS0tLTAtLS0tLS8tLS0tLf/AABEIAMEBBQMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBBAUDAgj/xABDEAACAgEBBQUFBQUDDQEAAAAAAQIDEQQFBhIhMRNBUWFxByIygZEUI0KCoVJykrHBVGJzFhckMzU2U1WTs9LT4xX/xAAbAQEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//EADgRAQACAQIFAAYJAwMFAAAAAAABAgMEEQUSITFBEyJRYXHwBhQygZGhsdHhIzTBQlLxFTM1U8L/2gAMAwEAAhEDEQA/ALxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADm7wau2rS3Tow7K65Sims9FlvHfyzyNeS01rMx3SNJjpkzUrftM7ItTvlZPQ12Jx7eU3CfLK9zm5KPmnD+IgZ9ZauKJr9qVvbhNa6q1J35Ijf8U1085OK48KXCuNLopNc/lnJY0mZjr3UVoiJnbs9jJiAAAAAAAAAAAAAAAAAGGBjiBtLn37f0db4Z6uiL707IZ/mYTkrHlIrpM9o3rSfwb9NsZpSjJSTWVJNOLXimuplE79miYmJ2mH2evGMgeM9XXF8MrIKT6RcoqT+RjzR7WcY7zG8RO3we2TJgxkApp9GmCYmO76AAYyBjiXTKz4d4Np7oTvpVDT2faVqlVZNYVb4nKSiknwKKba6ZTWOZVazBMX9LS20rzhlrZaehnHzRHmPHxaNuwaKdAr9NbHjeJ1y404cclFcMXw5lw8MnFNdeveMmDHGKuS3ePwb663Nk1Xo8tenaenXaPnq6G4exFCUtXPVfaLbI8M1FycY5alibl70pcuWUsZ6EjSctt7xbf/AAjcW1fNEYK4+Wsdk2RNUoAAAAAAAAAAAAAAAAwwOTvFt2rQ1dpZzb5V1r4py8F4Lxfca8uSMcbyl6PR5NVk5KffPsVJtzePU61vtbGod1MW41peDX4vVlXkz2vPd2ek4bg00erG8+2XISNKwWF7JdTZm+rLdcVCcV3RnJyTx6pLl5E/RWmd4cv9IsdI5Mkd53ifu2WHqLo1xc5yUYxTcpPklFLLbJ0ztG8uarWbTFax1lVW8+/N2ok4aaUqaua4lytmvHPWC8lz8fArc2qm3SvZ1+g4LjxRFs3W3s8R+6HyWXl82+rfNt+bIm8917EcsbQtr2aa+y7RtWty7G11wk+bcOCElz78cTXyLXSXm1OrieN4KYtT6nTeN9vZLm+1La1tfZ0VycI2RlOxxbTkk0lHK7uufka9ZktWIiEvgGlx5JtlvG+2233oNsXa1ujtVlUmsNccM4jOPfGS6fPuIWPLalt4l0Oq0WPUY5pMRv4n2Lz0WqhdXCyt8UbIqUX4prKLmsxaN4fP8mO2O80t3jo9z1gjG/m3Xo9NiuWLbnw1vviusp/Jfq0R9Rl5K9O6z4To/rOf1vsx3/ZUUNRYp9orJqec9opPjz48XUq+e0Tvv1dtODFNeSaxt7NltbI0NG1NLp9RrKlZZGMlnMoptScXlJ4afDnDLOla5qRa8OL1GXLoc+TFgttDx0m6XBr7LpKp6edfDCnD5PEVjhxhJcMnlftHn1aJvMz29j3JxKJ0tccb88TvzJJs7ZlOnTVMOFSeZc2+fzNmLBTFExSFfmz5M0xN532bhuaQAAAAAAAAAAAAAAABhgUjvbtd6zVTnnMINwpXd2cX8S/efP5op8+Sb2d7wzSRp9PEeZ6y5ug0dmosjVTHjnN4iv5tvuS8TXSk2naqXnz0wY5vedohP9B7M4cKeo1Njl3xqUIw9MyTb9eROroo29aXNZfpFfefR0jb377/AJSmOxdjUaKvs6I4TeZSbzOUvGT7+70JdMdaRtCk1Wqy6m/PkneUN9qe2GlDSQeOJdpd5x4moRfk3GT/ACoiazJ05IXnANJFrTntHbpHxVy34le6lNd3/Z/ZfBWamx0Rksxrik7eF98nLlH0wyZi0kzG9pc/rOO1x25MMb7eZ7fysjZezqtLVGqmPDCHRdW2+bk33tssKVisbQ5fPnvnvOTJO8yj/tD2L9q03aQWbNPmccLm68feQXySePGKNGpxc9enhY8H1noM/Lbtbp+0qjKp3CxvZbtnKlpJvnHNlP7rfvxXo3n8zLDR5OnJLlOP6Ta0Z6x36T8fCwHInOc9yk979s/bNVKcXmuHuU+HAn8X5nl/QqNRk577u94XpPq2CInvPWf2c/ZegnqboU1/FZLGfBdXJ+iTfyNdKTe0VhK1OeuDFbJbx8wvXQaOFFUKq1iNcVGK8ku/zLmtYrG0PnmXJbJeb27y2MGTWyAAAAAAAAAAAAAAAAAANLbNrhprpx6wpskvVQbRjedqzLdp6xbLWs+Zj9VBxWF6FG+kLD9k+kj9/c+clwVx8o4cpY9fd/hRP0Ve9nL/AEiyTvTH46ysVE9zIBTG/wDa5bRuz+Ds4x/d7KEv5yZU6qd8su54LWI0ddvO/wCrT3X00btbp65rMZWptdz4E54fk+HHzMMEb5IiUjiOScelvavs/XouHeLXS02ktugk5Vwbin04uib8uZbZLctJmHDaTDGbPXHbtMqYu2zq5ycpaq9t9cWTivlGLSXoinnNe3WZd3TRaakcsUj8Hx/+pqf7TqP+tb/5D0l/bLP6pg/2V/CGoYN7Z2brp6e6F1fxVyUkvFd8X6rK+ZlS80tvDTqMFc+Kcdu0/MLK313lgtDDsJe9rY4g/wASqwu0l5PD4fJyLHPmiMcbeXJ8L4fa2qmMkdKd/j4/dVhWOzWT7Lti8MJauxc7Mwpz3Vp+9L8zWPSK8Sx0eLaOeXJcf1nNkjBWekd/j/Cfk1zwAAAAAAAAAAAAAAAAAAAHjq6VZXKD6TjKL9JJr+p5aN4mGVLTW0Wjw/P9tMq5OE1iVcnGa8JReH+qZR2jadpfSceSt6xevaeqS7g7fho75RueK71FSl3QnFvhk/J5ab9O7JJ0uWKW2ntKp4zobajHFqR61fzhb0JprKaaaymuaa8UyzcVMTE7S1Nr7Vp0lbsvmopdF+KT/Ziu9mN7xSN5btPp8me/JjjeVJ7c2k9XqLL5R4e0fKPhFJRin4vCWSoy357TZ32j00abDXFE9mvotVKmyFsPirnGUfBuLzh+T6fMwrblndtzYoy47Y7eYXVsvamm2jQ+FqUZx4banhyjlYcJr+vf3FzS9ckbw4HUabNpMu1ukx2nxPwRPam4GjojKyessprXP3uB48IpvnJ+HeRb6Skdd9lzg45qckxStImVfXqHHLs3Jwz7jkkpuPc5JdGQLRG/R0+Pn5Im/f3NrZOzLdVN10rilGuc8eUF09W2l8zLHjm87Q06rVU09IvftM7NFMwSXpO2TUU22oJqK8E5OTx82z2bTPdhWlazMxHfu3NhbLlrNRCmPLjfvy/ZrXxS+n6tGeKnPaIR9bqo0+Ccn4fHwvTTURrhGEEoxhFRjFdFFLCRcxG0bQ+fXtNrTae8vU9YgAAAAAAAAAAAAAAAAAAAYYFbe0jdqSm9XTHKkv8ASIrqmljtPTGM/XxIGqwzvz1dPwTiMRX6vkn4fsgJAdP8G1pNp6ilYp1FtS/ZhZOMfongzrktWNolHyaXBkne9In4w8NRfOyXFZOdkv2pylOWPDMuZjMzPeWzHjpjjakbR7uj70elndZGuqLnObxGK6+vkl4itZtO0PM2amGk3vO0Q+dTp51TlCyLhKDxKL5NMTWaztL3HkpkrF6zvEviEnF8UW4tdJJtSXo0eRLK1a2ja0bx72bbZTeZzlNro5Nyf1Z7MzPd5THSn2IiPhDEIttKKcm2lGKWW2+SSS6s8iJ7Q9taKxzTPRb24m7j0VLlal212HNdeCK+GGfq35stdPh9HXr3cRxbX/Wsu1fsx2/dBvaBsT7LqnOCxXqMzj4KzP3kfq+L83kQ9Vj5Lbx2l0PBdZ6fByW+1X9PH7IyRVutL2Z7F7Gh6ia9/UfB4qldP4uvpwlrpcfLXefLjuOaz0ub0Udq/r/CbEpRgAAAAAAAAAAAAAAAAAAAAAGJLIEK277PKLm56af2eT5uGOKlvyjycfly8iJl0lbda9JXmj45lxRy5Y5o/NGLPZ7r0+Spms8nGx9PNSisEadHk9y3rx7S7deaPu/ls7P9m+qk/v7aqo/3OK2bXo1FL6syrorT9qWnN9IcMR/TrMz7+kJ5sDdvT6GOKY5lJe/bLnZLyz3LyWETceGuONoc9q9fm1Vt7z09niGNvbtabXL76OJJYjbH3bEvDPevJ5QyYq5O5pNdm0s/056ezwhOt9ml6b7HUVTXcrFKt/Nx4s/QiW0U/wCmV/j+kVJj+pSfufGk9mupl/rb6a/Hg47Xj5qJ5Git5llk+kWKI9Sk/ft/KZbv7pabRPignZZ/xZ4clnuilyivQl4sFMfZRaziefVdLTtHsjs7+Dcr3M3h2JXrqXVZlc+KE18UZro19WseZryY4vXaUrR6u+lyekp/yh+i9mWLE79Sp1p84Qg4SkvBtyfCvHGWRaaLaes7wu830hm1NsdNp9sysKEFFJJJJcklySS7ibEbOamd53l9HoAAAAAAAAAAAAAAAAAAAAAAYyAyAAAMgZAwAyAyAyBkDGQGQGQGQMgAAAAAAAAAAAAAAAAAAB82SSTbeEllvwS7zyTaZ6Qrinau0dr3TWjt+zUVv4vheH8PE0suT64WEv5wufLmtMUnaHS202k0GOs568158PXSbS2js/Vwp1k5amq5pKxJzwm+HiUsZWHjKfd0Pa3y47xW3WJa8mDR6vTzkweravjfv8+5ta/a+ojtuvTq6Sqlw5q93heapPwz1S7zK2S0Z4rv0a8Wlwzw22aa+tHn74crbW9eq0u07F2sp012RTpxHh4HCOUuWc821z64NWTPeuXbwmaXhmHUaKJ22vO/V3d/ts2V6Kq7SXOPa2xxZHDzXKqyXevJfQ3ajJMY+aqu4TpK5NTOPNXfaJ6OdvttzU6fS6Syq+cHZU5WNcOZNVwfPK839TDUZLVrWayk8K0eHNny0vXeInp+MvZbE25/zCH1/wDmJx6jb7Tz61wuJ/7U/P3vjfLXa3R6XSr7S1a3KN048L42o+cf6IZ73pSvXq94Xp9Nqc+Tenq94ifDq+z7bVmq08ldNzspm1KTwm4y5xbx81+U2abLN69e6HxfSVwZo5I2rMbobrt7dXZrH2WonGqWoUYRSjw8CnGPXHeuf5iLbUXnJ0np2XmLhenrpd719blmfPfZY+820/smltt/FGOK/wDElyj+r/Qn5b8lJs5jRaf6xnrj9s/l5Q/cLeLUz1PYau2U+2rUqeNRT4kuLlhLPFFt/lIuny3m/LddcW0GCmH0unjtO0/Pul09/wDeC/TOqjTyVc785tePdjxKKxnkucub7sGzUZZrtEeUXhOix5ovly9Yr49rm67RbY0SjdXrJaxNpSrUZWdf7rzmPmsP+mua5qetFt0nFl4dqZnHbHye/f5/PdO9nXu2qFkoSrc4RcoSypRbXOLT8GTKzvES5/LSKXmsTvET39raMmAAAAAAAAAAAAAAAAAAANPbFMrNPdCHxTqsjH96UGkY3jesw24LRTLW09omP1Qr2TaqHZXVN4n2inw9JODhGOceTi/0ImjnpML36Q0tOSmTxMbb/fM/5d/bu9NWkvro7Ods7ce7Bx93ikox4svv5/Q33zRS0V8yrdLw7JnxWy7xER7fPwRnaP8AvDV+X/sTI1/7mFrg/wDEX+fMPOvQw1O29VTYsxsqsT8V7lOGvNdfkecsW1Fon2fsznNbDwzFkp3iY/8ApHdsXXaemWz7+f2fUKyuXdwOE08f3XxRkuvxSXcabzNazit4Welx0zZq6zH/AKo2mPf0dv2iPGi0LxnFDePH7qs3arrjrCu4J/c5vj/mXX/yF1DX+1tRz/xP/abPq1p688oc8XxRP9vX5+5re0yp10aSDk5uEnFzfWTjCK4n5vqY6uNq1buBW5suWdu8f5c3aWpnsvW6qMOUdVRKVfgp2c4y/LLtfqa5tOHJb3wlYMUa/TYpnvS20/CP42c/VbO+z07PysO6Ttl3PErKuBP0io/qa7U5a0j70jFqJzZNRt2iNvwiXf8AantDjsq0scvH3tiim5ZeYwSXe8Kbx6G/WW3mKK7gODlrfPPTxEz+bh7c2wnqNPqaNNdQ9NGEcTikpRreYxT6c4ucX6mnLk9at4jbZYaTST6HJhvkrbm69J9vn8dkw3qv2dq3RTqJTjO2MZ6e2C6RteFmTWMNrmn5EvNOO8xW3dSaCus08Xy4YjaOkx8Pd3cLa27+t2VW79PrpOuMopw5wwm0l7jbhLm/BGm+K+GOatuiw02t02vv6LLi6z5hPN2doy1WkqunFRlOPvJdOKMnFteTaz8yZivz0i0ue1uCMGe2KO0OqbEYAAAAAAAAAAAAAAAAAAGGBEttbiU6i13VWz005NuThzi5PrJLKab8mRr6aLTzRO0rjS8YyYccY71i0e96bv7k06W3tp2T1Fq+Gc8JRbWHJLm28d7bPcWmrSebvLDV8WyZ6ejrEVr7I+ezZ1G60J6+Otds1KGMV4jwPEHHm+veZThicnO1U4heulnTbRtPl9aXdmNeunrVbNysTTrxHgWVFcn1/D+ojDEZJu8vr7W01dPt0jz+P7vPejdGraEozlOVU4Jx44qLcodVGWfB5x6s8zYK5e7LQcTyaOJisbxPiXzt3dGGsqoqldOC00eFNKLclwxjzz+6MmCLxETPZ7pOJ302S961ieZyP82lf9sv+kDV9Uj/AHSmf9dt/wCuro67cqF2mo07vsS0zk1PEXKXE/xZNltPFqxWZ7I2Lit8Wa+WtY9bx7GxvNulVr3W5znB1JxzHh96LxyefT9We5cEZNt2vRcSyaTmisRO/wCT62/uvDWTpk7JVfZvhjFRaa4ovDz0+FHuTBF9vcx0nEL6et6xG/N8/wCTT7rQjrpa2Vs5zlnhg1HgjmKiuHv5RWPmxGGIyc72/EL20saaI2iG9vDseOtolTOTgpOLU44coyjJNNZ9GvmzPJSL15ZaNHqrabNGWsdnHv3Ips0tdFlk5OhSVV3uqxQbzwNYw4rkseRqnT1msVnwmU4tlpmtlrEet3jx8WjH2e8TSv119sIvlXzXLwy5PHyRh9U3+1aZhInjfL1x4q1n2plpNNGqEa64qMYJRjFdFFEqIiI2hSXva9ptbrMvc9YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==",
//     },
//     {
//         id: 2,
//         name: "Lotte Cinema",
//         logo: "https://www.bing.com/images/search?q=image+logo+lotte+cinema&id=0121DFBB24F77D194F63C044F000CDF5E5B2AACF&FORM=IACFIR",
//     },
//     {
//         id: 3,
//         name: "Galaxy",
//         logo: "https://www.bing.com/images/search?q=image%20logo%20Galaxy%20r%E1%BA%A1p%20chi%E1%BA%BFu%20phim&FORM=IQFRBA&id=FAE2CCAB943AB8441BCCC21ECAC92A6E21431A2B",
//     },
// ];

// const theaterBrand = {
//     theaterBrandName:"",
//     logo: ""
// }


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddTheaterBrandDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setLogo(null);
      setLogoPreview(null);
      setNameError(false);
      setLogoError(false);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setLogoError(false);
    } else {
      setLogoError(true);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!logo) {
      setLogoError(true);
      hasError = true;
    }

    if (hasError) return;


    const formData = new FormData();
    formData.append("theaterBrandName", name);
    formData.append("logo", logo);
    console.log(formData)

    // axios.post("http://localhost:8080/api/admin/theaterbrands", formData, {
    //     headers: {
    //         // "Content-Type": "multipart/form-data"
    //         Authorization: 'Bearer ...'
    //     }
    // })
    // .then((response) => {
    //     console.log(formData)
    //     toast.success("Thêm thương hiệu thành công!");
    // })
    // .catch((error) => {
    //     toast.error("Lỗi khi thêm thương hiệu!");
    // });
    axios.post("http://localhost:8080/api/admin/theaterbrands", formData, {
      // **KHÔNG tự set Content-Type để axios tự thêm boundary**
    })
    .then(() => alert("Upload thành công"))
    .catch(() => alert("Upload lỗi"));



    // console.log('formData', formData);
    // onAdd(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, bgcolor: "#1e1e2f" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
        Thêm thương hiệu
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          label="Tên thương hiệu"
          fullWidth
          variant="filled"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError && e.target.value.trim()) setNameError(false);
          }}
          error={nameError}
          helperText={nameError ? "Vui lòng nhập tên thương hiệu." : ""}
          sx={{ mb: 3, input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <Typography sx={{ mb: 1, color: "#fff" }}>Logo thương hiệu *</Typography>

        <Box
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          sx={{
            border: "2px dashed",
            borderColor: logoError ? "#f44336" : "#aaa",
            borderRadius: 2,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s",
            mb: 2,
            "&:hover": { borderColor: "#fff", color: "#fff" },
          }}
        >
          {logoPreview ? (
            <>
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLogo();
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                }}
              >
                <Delete />
              </IconButton>
            </>
          ) : (
            <Box textAlign="center">
              <CloudUpload fontSize="large" />
              <Typography>Tải lên logo (PNG, JPG - tối đa 2MB)</Typography>
            </Box>
          )}

          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>

        {logoError && (
          <Typography color="error" variant="caption">
            Vui lòng chọn logo hợp lệ (PNG, JPG).
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          color="primary"
          onClick={handleSubmit}
        >
          Thêm thương hiệu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const TheaterList = () => {
    const [theaterBrands, setTheaterBrands] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [theaterToDelete, setTheaterToDelete] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchTheaters();
        fetchTheaterBrands();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredTheaters(theaters.filter(theater =>
                theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                theater.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                theater.city.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredTheaters(theaters);
        }
    }, [theaters, searchTerm]);

    const fetchTheaters = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/admin/theaters')
            .then(response => {
                setTheaters(response.data);
                setFilteredTheaters(response.data);
            })
            .catch(error => {
                toast.error('Lỗi khi tải dữ liệu rạp chiếu phim');
            })
            .finally(() => setLoading(false));
    };
    const fetchTheaterBrands = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/admin/theaterbrands')
            .then(response => {
                setTheaterBrands(response.data);
            })
            .catch(error => {
                toast.error('Lỗi khi tải dữ liệu thương hiệu rạp chiếu phim');
            })
            .finally(() => setLoading(false));
    };




    const confirmDelete = (theater) => {
        setTheaterToDelete(theater);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (theaterToDelete) {
            axios.delete(`http://localhost:8080/api/admin/theaters/${theaterToDelete.id}`)
                .then(() => {
                    setTheaters(prev => prev.filter(theater => theater.id !== theaterToDelete.id));
                    toast.success('Đã xóa rạp chiếu phim thành công');
                    setDeleteDialogOpen(false);
                })
                .catch(error => {
                    toast.error('Lỗi khi xóa rạp chiếu phim');
                });
        }
    };

    // Stats calculation
    const totalScreens = theaters.reduce((sum, theater) => sum + theater.totalScreens, 0);
    const uniqueCities = new Set(theaters.map(theater => theater.city)).size;

    // Function to generate gradient avatar background color based on theater name
    const getGradientColor = (name) => {
        const colors = [
            'linear-gradient(135deg, #FF5252, #9C27B0)',
            'linear-gradient(135deg, #FF9100, #FF5252)',
            'linear-gradient(135deg, #651FFF, #D500F9)',
            'linear-gradient(135deg, #FF6D00, #FF3D00)',
            'linear-gradient(135deg, #00B0FF, #2979FF)',
            'linear-gradient(135deg, #00E676, #00C853)'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
                {/* Header */}
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, md: 3 },
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #FF5252 0%, #FF9100 100%)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                        transform: 'translate(30%, -60%)'
                    }} />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                color="white"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.25)'
                                }}
                            >
                                <VideoSettings sx={{ mr: 1.5, fontSize: 35 }} />
                                Theater Management
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.85)' }}>
                                Manage all theaters and screens in one place
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            component={Link}
                            to="/theaters/add"
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'rgba(0,0,0,0.25)',
                                color: 'white',
                                px: 3,
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.4)',
                                }
                            }}
                        >
                            Add New Theater
                        </Button>
                    </Stack>
                </Paper>


                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" color="white">
                            Theater Brands
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {theaterBrands.map((brand) => (
                            <Card
                                key={brand.id}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 20px rgba(25, 118, 210, 0.3)",
                                    cursor: "pointer",
                                    position: "relative",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: "0 12px 30px rgba(25, 118, 210, 0.6)",
                                    },
                                }}
                            >
                                {/* Logo full card */}
                                <CardMedia
                                    component="img"
                                    image={brand.logo}
                                    alt={brand.name}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                                {/* Overlay tên thương hiệu */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        bgcolor: "rgba(0, 0, 0, 0.6)",
                                        color: "#90caf9",
                                        py: 0.6,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        fontSize: 14,
                                        textTransform: "uppercase",
                                        letterSpacing: 1,
                                        backdropFilter: "blur(5px)",
                                    }}
                                >
                                    {brand.theaterBrandName}
                                </Box>
                            </Card>

                        ))}
                        <Card
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: 4,
                                overflow: "hidden",
                                boxShadow: "0 8px 20px rgba(25, 118, 210, 0.3)",
                                cursor: "pointer",
                                position: "relative",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 12px 30px rgba(25, 118, 210, 0.6)",
                                },
                            }}
                            onClick={() => setOpen(true)}
                        >

                            <AddIcon sx={{ color: "white", fontSize: 48 }} />
                        </Card>
                            <AddTheaterBrandDialog
                                open={open}
                                onClose={() => {
                                    console.log("Đóng dialog");
                                    setOpen(false);
                                }}
                            // onAdd={handleAddBrand}
                            />
                    </Box>
                </Box>
                {/* Search Bar */}
                <Paper sx={{
                    p: 1.5,
                    mb: 4,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#1e1e1e',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
                }}>
                    <Search sx={{ mx: 1.5, color: '#FF9100' }} />
                    <TextField
                        fullWidth
                        placeholder="Search theaters by name, address or city..."
                        variant="standard"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: '1.1rem' }
                        }}
                    />
                </Paper>

                {/* Content */}
                {loading ? (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress size={60} thickness={5} sx={{ color: '#FF5252' }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            Loading data...
                        </Typography>
                    </Box>
                ) : filteredTheaters.length === 0 ? (
                    <Fade in={!loading}>
                        <Paper sx={{
                            p: 5,
                            textAlign: 'center',
                            borderRadius: 3,
                            bgcolor: '#1e1e1e',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
                        }}>
                            <Movie sx={{ fontSize: 80, color: '#666', mb: 3 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                No theaters found
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please adjust your search or add a new theater
                            </Typography>
                        </Paper>
                    </Fade>
                ) : (
                    <Fade in={!loading}>
                        <TableContainer component={Paper} sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            bgcolor: '#1e1e1e',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'rgba(255, 82, 82, 0.15)' }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Tên Rạp</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Địa Điểm</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Thành Phố</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Màn Hình</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTheaters.map((theater) => (
                                        <TableRow
                                            key={theater.id}
                                            sx={{
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 82, 82, 0.08)',
                                                    '& .MuiIconButton-root': { opacity: 1 }
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            background: getGradientColor(theater.name),
                                                            width: 45,
                                                            height: 45,
                                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                                        }}
                                                    >
                                                        {theater.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight="bold">{theater.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {theater.id}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocationOn fontSize="small" sx={{ color: '#FF9100' }} />
                                                    <Typography>{theater.address}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={theater.city}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        bgcolor: 'rgba(255, 82, 82, 0.15)',
                                                        color: '#FF5252',
                                                        borderRadius: '12px',
                                                        py: 0.5
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tv style={{ width: 20, height: 20, color: '#FF9100' }} />
                                                    <Typography>
                                                        {theater.totalScreens} {theater.totalScreens === 1 ? 'màn hình' : 'màn hình'}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <IconButton
                                                        component={Link}
                                                        to={`/theaters/edit/${theater.id}`}
                                                        sx={{
                                                            color: '#FF9100',
                                                            bgcolor: 'rgba(255, 145, 0, 0.1)',
                                                            opacity: 0.8,
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255, 145, 0, 0.2)',
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                        size="small"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => confirmDelete(theater)}
                                                        sx={{
                                                            color: '#FF5252',
                                                            bgcolor: 'rgba(255, 82, 82, 0.1)',
                                                            opacity: 0.8,
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255, 82, 82, 0.2)',
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                        size="small"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Fade>
                )}

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            bgcolor: '#1e1e1e',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">Confirm Deletion</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the theater "{theaterToDelete?.name}"? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                        >
                            Delete Theater
                        </Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    theme="dark"
                />
            </Box>
        </ThemeProvider>
    );
};

export default TheaterList;


// import { useState, useRef, useEffect } from 'react';

// // Import các thành phần MUI
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';

// // AddTheaterBrandDialog Component với MUI
// function AddTheaterBrandDialog({ open, onClose, onAdd }) {
//     const [name, setName] = useState("");
//     const [logo, setLogo] = useState("");

//     // Reset form khi dialog mở
//     useEffect(() => {
//         if (open) {
//             setName("");
//             setLogo("");
//         }
//     }, [open]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!name || !logo) {
//             alert("Vui lòng nhập đầy đủ thông tin");
//             return;
//         }
//         onAdd({ name, logo });
//         setName("");
//         setLogo("");
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle>Thêm mới thương hiệu rạp chiếu phim</DialogTitle>
//             <DialogContent>
//                 <Box
//                     component="form"
//                     sx={{ mt: 1 }}
//                     onSubmit={handleSubmit}
//                     noValidate
//                     autoComplete="off"
//                 >
//                     <TextField
//                         label="Tên thương hiệu"
//                         fullWidth
//                         margin="normal"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                     <TextField
//                         label="URL logo"
//                         fullWidth
//                         margin="normal"
//                         value={logo}
//                         onChange={(e) => setLogo(e.target.value)}
//                         required
//                     />
//                     <DialogActions sx={{ px: 0, pt: 2 }}>
//                         <Button onClick={onClose}>Hủy</Button>
//                         <Button type="submit" variant="contained">
//                             Thêm
//                         </Button>
//                     </DialogActions>
//                 </Box>
//             </DialogContent>
//         </Dialog>
//     );
// }

// // Component cha để quản lý trạng thái dialog
// const TheaterBrandManager = () => {
//     const [open, setOpen] = useState(false);
    
//     const handleAddBrand = (brandData) => {
//         console.log('Brand added:', brandData);
//         // Logic xử lý thêm thương hiệu tại đây
//     };
    
//     return (
//         <div className="p-4">
//             <Button 
//                 variant="contained" 
//                 onClick={() => setOpen(true)}
//             >
//                 Thêm thương hiệu mới
//             </Button>
            
//             <AddTheaterBrandDialog
//                 open={open}
//                 onClose={() => {
//                     console.log("Đóng dialog");
//                     setOpen(false);
//                     console.log('open:', open);
//                 }}
//                 onAdd={handleAddBrand}
//             />
//         </div>
//     );
// };

// export default TheaterBrandManager;