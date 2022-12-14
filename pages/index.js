import {
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
// import dynamic from "next/dynamic";
// import axios from "axios";
import NextLink from "next/link";
import Layout from "../components/Layout";
import Product from "../models/Product";
// import data from "../utils/data";
import db from "../utils/db";
import { convertCategoryToUrl } from '../utils/common.js'

export default function Home(props) {
  const { products } = props;

  // const { products } = data;

  return (
    <Layout props={props}>
      <div>
        <h1>Categories</h1>
        <Grid container rowSpacing={4} columnSpacing={8}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.name}>
              <NextLink
                href={`/category/${convertCategoryToUrl(product.category)}`}
                passHref
              >
                <Card
                  sx={{
                    margin: "0 auto 0 auto",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: "primary.main",
                    "&:hover": {
                      boxShadow: "0 5px 20px -5px",
                      color: "success.main",
                    },
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                      sx={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                      }}
                    ></CardMedia>
                  </CardActionArea>
                </Card>
              </NextLink>
              <Typography
                component="h2"
                variant="h2"
                sx={{
                  textAlign: "center",
                }}
              >
                {product.category}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}


export async function getStaticProps() {
  await db.connect();
  const products = await Product.find({}).lean();

  const oneProductForEachCategory =
  products.length > 0
    ? products.reduce((previousValue, currentValue) => {
        if (!Array.isArray(previousValue)) {
          previousValue = [].concat(previousValue);
        }
        if (
          previousValue.find(
            (value) => value.category === currentValue.category
          )
        )
          return previousValue;
        return previousValue.concat(currentValue);
      })
    : [];
  await db.disconnect();
  return {
    props: {
      products: oneProductForEachCategory.map(db.convertDocToObj),
    },
    revalidate: 60
  };
}

// export default dynamic(() => Promise.resolve(Home), { ssr: false });
