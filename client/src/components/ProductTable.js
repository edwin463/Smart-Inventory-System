import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function ProductTable({ products, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Product List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Sales Count</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Link
                  to={`/products/${p.id}`}
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  {p.name}
                </Link>
              </TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.category?.name || "—"}</TableCell>
              <TableCell>{p.supplier?.name || "—"}</TableCell>
              <TableCell>{p.sales_count || 0}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="error"
                  onClick={() => onDelete(p.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductTable;
