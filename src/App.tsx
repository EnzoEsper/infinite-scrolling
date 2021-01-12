import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Container } from "@material-ui/core";
import { Waypoint } from "react-waypoint";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const App = () => {
  const classes = useStyles();

  const [solicitudes, setSolicitudes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const response = await axios.get(
        `http://localhost:4000/solicitudes?_page=1&_limit=50`
      );

      setSolicitudes(response.data);
    };
    fetchSolicitudes();
  }, []);

  const fetchMoreSolicitudes = async () => {

    let response : any;
    let newPage : number;

    if (hasMorePages) {
      newPage = page + 1;
      response = await axios.get(
        `http://localhost:4000/solicitudes?_page=${newPage}&_limit=50`
        );
      setPage(newPage);

      const data: [] = response.data;

      if (response!.data.length === 0) {
        return setHasMorePages(false);
      }

      setSolicitudes((prevSolicitudes) => {
      return [...prevSolicitudes, ...data];
      });
    }
  };

  if (solicitudes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <br/>
      <Paper>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Estado Solicitud</TableCell>
              <TableCell>Index</TableCell>
              <TableCell align="right">Nombre</TableCell>
              <TableCell align="right">Apellido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud: any, index) => (
              <React.Fragment key={solicitud.id}>
                <TableRow key={solicitud.id}>
                  <TableCell component="th" scope="row">
                    {solicitud.estadoSolicitud}
                  </TableCell>
                  <TableCell align="right">
                    {index}
                  </TableCell>
                  <TableCell align="right">
                    {solicitud.cliente.nombre}
                  </TableCell>
                  <TableCell align="right">
                    {solicitud.cliente.apellido}
                  </TableCell>
                </TableRow>
                {index === solicitudes.length - 10 && (
                  <Waypoint
                    onEnter={() => {
                      fetchMoreSolicitudes();
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <br/>
    </Container>
  );
};

export default App;