import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

type Pokemon = {
  id: number;
  name: string;
  sprites?: {
    front_default?: string;
  };
  types?: Array<{ type: { name: string } }>;
  height?: number;
  weight?: number;
};

export default function Details() {

    const params = useLocalSearchParams()

    // useEffect
    useEffect(() => {
        const name = Array.isArray(params.name) ? params.name[0] : params.name ?? '';
        if (name) fetchPokemonByName(name);
    });

    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    

    
    async function fetchPokemonByName(name: string) {

        try{
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
            const data = (await response.json()) as Pokemon;
            setPokemon(data);
            console.log(data);
            
        }catch(e){
            console.log(e);
            
        }


    
}

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding:16,
      }}
    >
     
    </ScrollView>
  );
}

// 4/ style
const styles = StyleSheet.create({});


