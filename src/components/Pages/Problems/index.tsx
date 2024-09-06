import { useQuery } from '@tanstack/react-query';
import getProblems from '../../../services/getProblems';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { Problem, User } from '../../../utils/types';
import { createColumnHelper } from '@tanstack/react-table';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';
import { useUserSlice } from '../../../store/user';
import { difficultyColors } from '../../../constants/Index';

export default function ProblemsSet({ user }: { user: User | null }) {
  const [open, setOpen] = useState<boolean>(true);
  const setUser = useUserSlice((state) => state.setUser);
  const handleClose = () => {
    setOpen(false);
  };
  const columnHelper = createColumnHelper<Problem>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problems'],
    queryFn: getProblems,
  });
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.status, {
        id: 'Status',
        cell: (info) => {
          return <div> {info.getValue()}</div>;
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
    []
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
