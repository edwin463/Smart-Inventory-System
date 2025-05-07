// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   CircularProgress,
// } from "@mui/material";

// const BASE_URL = process.env.REACT_APP_API_URL;

// function AdminUserReports() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     fetch(`${BASE_URL}/reports/user-summary`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch user reports");
//         return res.json();
//       })
//       .then(setReports)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <CircularProgress sx={{ m: 4 }} />;
//   if (error)
//     return (
//       <Typography color="error" sx={{ m: 4 }}>
//         {error}
//       </Typography>
//     );

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         All User Reports
//       </Typography>

//       {reports.length === 0 ? (
//         <Typography>No reports available.</Typography>
//       ) : (
//         <Paper sx={{ p: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>User ID</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Total Revenue (KES)</TableCell>
//                 <TableCell>Total Expenses (KES)</TableCell>
//                 <TableCell>Profit (KES)</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reports.map((r) => (
//                 <TableRow key={r.user_id}>
//                   <TableCell>{r.user_id}</TableCell>
//                   <TableCell>{r.email}</TableCell>
//                   <TableCell>{r.total_revenue.toLocaleString()}</TableCell>
//                   <TableCell>{r.total_expenses.toLocaleString()}</TableCell>
//                   <TableCell>{r.profit.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>
//       )}
//     </Box>
//   );
// }

// export default AdminUserReports;
