import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom'; // If using React Router

const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h1" align="center" >
          Welcome to CNOME
        </Typography>
        <Grid container spacing={3} mt={5}>
          {/* Analytics Feature 1 */}
          <Grid item xs={12} md={4}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h3" align="center" mb={3}>
                  Mutation Detection
                </Typography>
                <Typography variant="body1" align="center" mb={3}>
                  Analyze genetic mutations in a genome sequence to identify potential health risks.
                </Typography>
                <Button
                  component={Link}
                  to="/genetic-mutations"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Feature 2 */}
          <Grid item xs={12} md={4}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h3" align="center" mb={3}>
                  KMer Analysis
                </Typography>
                <Typography variant="body1" align="center" mb={3}>
                  Perform KMer analysis on genome sequences to identify recurring patterns.
                </Typography>
                <Button
                  component={Link}
                  to="/kmer-analysis"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Feature 3 */}
          <Grid item xs={12} md={4}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h3" align="center" mb={3}>
                  Genetic Similarity
                </Typography>
                <Typography variant="body1" align="center" mb={3}>
                  Compare two genome sequences to find similarities and differences.
                </Typography>
                <Button
                  component={Link}
                  to="/similarity"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
