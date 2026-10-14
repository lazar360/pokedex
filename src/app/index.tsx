import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

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
          };
        })
      );


      setPokemons(detailedPokemons)

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(p) => p.name}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
