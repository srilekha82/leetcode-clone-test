import { useQuery } from '@tanstack/react-query';
import getProblems from '../../../services/getProblems';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo, useState } from 'react';
import { Problem } from '../../../utils/types';
import { createColumnHelper } from '@tanstack/react-table';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';
import { difficultyColors } from '../../../constants/Index';
import { isAccepted, isRejected } from '../../../utils/helpers';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useUserSlice } from '../../../store/user';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => {
    setOpen(false);
  };
  const columnHelper = createColumnHelper<Problem>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problems'],
    queryFn: getProblems,
  });

  const user = useUserSlice((state) => state.user);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.status, {
        id: 'Status',
        cell: (info) => {
          let icon;
          if (user) {
            icon = isAccepted(info.row.original._id, user?.submissions) ? (
              <TaskAltOutlinedIcon color="success" />
            ) : isRejected(info.row.original._id, user?.submissions) ? (
              <PendingOutlinedIcon color='warning' />
            ) : null;
          } else {
            icon = null;
          }
          return <div> {icon}</div>;
        },
      }),
      columnHelper.accessor((row) => row.title, {
        id: 'Title',
        cell: (info) => {
          return (
            <Link to={`/problems/${info.row.original._id}${info.row.index + 1}`}>
              {info.row.index + 1}. {info.getValue()}
            </Link>
          );
        },
      }),
      columnHelper.accessor((row) => row.difficulty, {
        id: 'Difficulty',
        cell: (info) => {
          return <div style={{ color: difficultyColors[info.getValue()] }}>{info.getValue()}</div>;
        },
      }),
    ],
    [user]
  );
  if (isLoading) {
    return (
      <>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isError) {
    return <p>{error.message}</p>;
  }
  return <ProblemsTable columns={columns as []} data={data?.data as Problem[]} />;
}
