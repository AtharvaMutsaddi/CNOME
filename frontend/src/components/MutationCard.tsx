import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface MutationCardProps {
  name: string;
  geneURL: string;
  imgURL: string;
  description: string;
}

const MutationCard: React.FC<MutationCardProps> = ({
  name,
  geneURL,
  imgURL,
  description,
}) => {
  return (
    <Card sx={{ maxWidth: 345,marginBottom:"10px" }}>
      <CardMedia
        component="img"
        height="140"
        image={imgURL}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <a href={geneURL} target="_blank" rel="noopener noreferrer">
            Gene URL
          </a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MutationCard;
