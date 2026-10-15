import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { colorsByType } from "../constants/colors";

// 1/ les variables
interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  }
}

// fonction principale
export default function Index() {

  // 2/ hooks
  // useState
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  // useEffect
  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack:details.sprites.back_default,
            types:details.types,
          };
        })
      );

      setPokemons(detailedPokemons)

    } catch (e) {
      console.log(e)
    }
  }

  // 3/ vue
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding:16,
      }}
    >
      {pokemons.map((pokemon) => (
      <Link key={pokemon.name}
      href={{ pathname: "/details", params:{name: pokemon.name}}}
      style={{
          backgroundColor: (colorsByType[pokemon.types[0].type.name] ?? '#E0E0E0') + '50', // '50' = opacité en hexadécimal (~31 %)
          padding: 20,
          borderRadius: 20,
        }}
      >
        <View>
          <Text style={styles.name} >{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View style = {{
            flexDirection: "row-reverse"
          }}>
            <Image
              source={{ uri:pokemon.image}}
              style={{width:150, height:150}}
            />
            <Image
              source={{ uri:pokemon.imageBack}}
              style={{width:150, height:150}}
            />

          </View>
        </View>
      </Link>
      ))}
    </ScrollView>
  );
}

// 4/ style
const styles = StyleSheet.create({
  name:{
    fontSize:28,
    fontWeight:'bold',
    textAlign:'center',
  },
  type:{
    fontSize:20,
    color:'grey',
    textAlign:'center',
  },
});
