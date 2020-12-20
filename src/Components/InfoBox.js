import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography} from "@material-ui/core"
import '../InfoBox.css'

const InfoBox = ({ title, cases, total}) => {
  return (
    <div>
      <Card classname="infoBox">
        <CardContent>
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>

          <h2 className="infoBox__cases">{cases}</h2>
          <Typography className="infoBox__total" color ="textSecondary">
            Total: {total}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
