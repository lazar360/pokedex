import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getTypeColor } from "../constants/colors";

// 1/ les variables
type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number; // en décimètres
  weight: number; // en hectogrammes
};

// noms courts des statistiques
const statLabels: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Att. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};

// fonction principale
export default function Details() {

  // 2/ hooks
  const params = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  // useEffect : ne se relance que si le nom change
  useEffect(() => {
    if (!params.name) return;
    let ignore = false; // évite d'afficher une ancienne réponse si on quitte l'écran

    fetch("https://pokeapi.co/api/v2/pokemon/" + params.name)
      .then((response) => response.json() as Promise<Pokemon>)
      .then((data) => {
        if (!ignore) setPokemon(data);
      })
      .catch((e) => console.log(e));

    return () => {
      ignore = true;
    };
  }, [params.name]);

  // chargement en cours
  if (!pokemon) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const mainColor = getTypeColor(pokemon.types[0]?.type.name);

  // 3/ vue
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {/* en-tête : images, numéro, nom, types */}
      <View style={[styles.header, { backgroundColor: mainColor + "50" }]}>
        <View style={{ flexDirection: "row" }}>
          {pokemon.sprites.front_default && (
            <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
          )}
          {pokemon.sprites.back_default && (
            <Image source={{ uri: pokemon.sprites.back_default }} style={styles.image} />
          )}
        </View>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
        <View style={styles.types}>
          {pokemon.types.map(({ type }) => (
            <Text
              key={type.name}
              style={[styles.typeBadge, { backgroundColor: getTypeColor(type.name) }]}
            >
              {type.name}
            </Text>
          ))}
        </View>
      </View>

      {/* taille et poids */}
      <View style={styles.row}>
        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          <Text style={styles.infoLabel}>Taille</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          <Text style={styles.infoLabel}>Poids</Text>
        </View>
      </View>

      {/* talents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Talents</Text>
        <Text style={styles.abilities}>
          {pokemon.abilities.map(({ ability }) => ability.name).join(", ")}
        </Text>
      </View>

      {/* statistiques de base, barre sur 255 (valeur max) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statLabel}>{statLabels[stat.name] ?? stat.name}</Text>
            <Text style={styles.statValue}>{base_stat}</Text>
            <View style={styles.statBar}>
              <View
                style={{
                  width: `${Math.min(base_stat / 255, 1) * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  backgroundColor: mainColor,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// 4/ style
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  id: {
    fontSize: 16,
    color: "grey",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  types: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoLabel: {
    color: "grey",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  abilities: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    width: 80,
    color: "grey",
  },
  statValue: {
    width: 32,
    fontWeight: "bold",
    textAlign: "right",
  },
  statBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
});
