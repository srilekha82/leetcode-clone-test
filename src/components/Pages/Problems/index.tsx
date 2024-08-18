// import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from "@tanstack/react-query";
import getProblems from "../../../services/getProblems";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => {
    setOpen(false);
  };

  const {data,isLoading,isError,error}=useQuery({
    queryKey:['problems'],
    queryFn:getProblems
  })

  if (isLoading) {
    return <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop></>
  }
  return <div>Problems</div>;
}
