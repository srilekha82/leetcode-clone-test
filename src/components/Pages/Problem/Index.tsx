import { useParams } from 'react-router';

export default function Problem() {
  const { problemname } = useParams();
  console.log(problemname);
  return <div>Index</div>;
}
