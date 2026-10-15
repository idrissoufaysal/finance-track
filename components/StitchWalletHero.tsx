import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
  Circle,
  Ellipse,
  G,
  Path,
} from "react-native-svg";

interface StitchWalletHeroProps {
  scale?: number;
}

export function StitchWalletHero({ scale = 1 }: StitchWalletHeroProps) {
  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      {/* 1. Piédestal 3D avec doubles anneaux d'ombre et de lumière */}
      <View style={styles.pedestalWrap}>
        <Svg width={300} height={100} viewBox="0 0 300 100">
          <Defs>
            {/* Ombre portée au sol */}
            <SvgRadialGradient id="groundShadow" cx="50%" cy="50%" rx="50%" ry="45%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0.85" />
              <Stop offset="60%" stopColor="#020B08" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#020B08" stopOpacity="0" />
            </SvgRadialGradient>

            {/* Anneau inférieur (sombre) */}
            <SvgLinearGradient id="subRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#133329" />
              <Stop offset="100%" stopColor="#081A14" />
            </SvgLinearGradient>

            {/* Anneau supérieur (reflet vert forêt) */}
            <SvgLinearGradient id="topRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#1F473B" />
              <Stop offset="100%" stopColor="#102D24" />
            </SvgLinearGradient>
          </Defs>

          {/* Ombre au sol */}
          <Ellipse cx="150" cy="55" rx="140" ry="32" fill="url(#groundShadow)" />

          {/* Anneau inférieur */}
          <Ellipse cx="150" cy="52" rx="130" ry="28" fill="url(#subRingGrad)" />

          {/* Anneau supérieur */}
          <Ellipse cx="150" cy="40" rx="112" ry="24" fill="url(#topRingGrad)" />
          {/* Liseré supérieur lumineux */}
          <Ellipse
            cx="150"
            cy="40"
            rx="110"
            ry="23"
            fill="none"
            stroke="#2B5F50"
            strokeWidth="1.2"
            opacity="0.6"
          />
        </Svg>
      </View>

      {/* 2. Composition Portefeuille en cuir incliné (-11 degrés) & Carte de crédit */}
      <View style={styles.walletTransformWrap}>
        <Svg width={210} height={230} viewBox="0 0 210 230">
          <Defs>
            {/* Dégradé de la carte de crédit métallique */}
            <SvgLinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7B8F89" />
              <Stop offset="45%" stopColor="#576B65" />
              <Stop offset="100%" stopColor="#3E4F4A" />
            </SvgLinearGradient>

            {/* Dégradé de la puce dorée */}
            <SvgLinearGradient id="goldChipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F3D59B" />
              <Stop offset="50%" stopColor="#E2BA6F" />
              <Stop offset="100%" stopColor="#B3873B" />
            </SvgLinearGradient>

            {/* Dégradé du corps du portefeuille en cuir */}
            <SvgLinearGradient id="leatherBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <Stop offset="0%" stopColor="#1B4337" />
              <Stop offset="65%" stopColor="#0E2B22" />
              <Stop offset="100%" stopColor="#071C16" />
            </SvgLinearGradient>

            {/* Dégradé du rabat en cuir */}
            <SvgLinearGradient id="leatherFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#1D4A3C" />
              <Stop offset="100%" stopColor="#113329" />
            </SvgLinearGradient>

            {/* Dégradé du fermoir pression en laiton doré */}
            <SvgRadialGradient id="brassClaspGrad" cx="35%" cy="35%" rx="65%" ry="65%">
              <Stop offset="0%" stopColor="#FFF2D6" />
              <Stop offset="25%" stopColor="#E6C892" />
              <Stop offset="65%" stopColor="#B38747" />
              <Stop offset="100%" stopColor="#6E4D1F" />
            </SvgRadialGradient>
          </Defs>

          {/* Ombre sous le portefeuille */}
          <Ellipse cx="105" cy="205" rx="75" ry="16" fill="#000000" opacity="0.65" />

          {/* --- A. Carte de crédit qui dépasse --- */}
          <G transform="translate(32, 10) rotate(5, 75, 55)">
            {/* Corps de la carte */}
            <Rect
              x="0"
              y="0"
              width="146"
              height="100"
              rx="12"
              fill="url(#cardGrad)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1"
            />
            {/* Reflet sur la carte */}
            <Path
              d="M 0,25 Q 70,10 146,30 L 146,0 L 0,0 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />

            {/* Puce dorée */}
            <Rect
              x="14"
              y="16"
              width="26"
              height="20"
              rx="4"
              fill="url(#goldChipGrad)"
              stroke="#99702B"
              strokeWidth="0.8"
            />
            {/* Lignes de circuit de la puce */}
            <Path
              d="M 14,26 L 40,26 M 27,16 L 27,36"
              stroke="#7E5618"
              strokeWidth="0.8"
              opacity="0.75"
            />

            {/* Numéro de carte masqué */}
            <Text
              style={{
                position: "absolute",
              }}
            />

            {/* Cercles Mastercard argentés entrelacés */}
            <Circle cx="114" cy="78" r="10" fill="rgba(220, 226, 223, 0.5)" />
            <Circle cx="126" cy="78" r="10" fill="rgba(240, 245, 242, 0.7)" />
          </G>

          {/* Numéro de carte sous forme vectorielle */}
          <G transform="translate(132, 38)">
            <Circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx="5" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx="14" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx="19" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx="28" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx="33" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.6)" />
          </G>

          {/* --- B. Corps du portefeuille en cuir --- */}
          <G transform="translate(18, 48)">
            {/* Fond du portefeuille */}
            <Rect
              x="0"
              y="0"
              width="174"
              height="160"
              rx="24"
              fill="url(#leatherBodyGrad)"
              stroke="#2B6351"
              strokeWidth="1.2"
            />

            {/* Couture artisanale en pointillés */}
            <Rect
              x="7"
              y="7"
              width="160"
              height="146"
              rx="18"
              fill="none"
              stroke="#337863"
              strokeWidth="1.6"
              strokeDasharray="4 3.5"
              opacity="0.85"
            />

            {/* Reflet sur le bord supérieur */}
            <Path
              d="M 24,1 L 150,1"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* --- C. Rabat du portefeuille --- */}
            <G transform="translate(0, 16)">
              {/* Ombre portée du rabat */}
              <Path
                d="M 0,20 Q 0,72 22,74 L 152,74 Q 174,72 174,20 L 174,0 L 0,0 Z"
                fill="#05120E"
                opacity="0.5"
                transform="translate(0, 4)"
              />
              {/* Corps du rabat */}
              <Path
                d="M 0,16 Q 0,70 20,72 L 154,72 Q 174,70 174,16 L 174,0 L 0,0 Z"
                fill="url(#leatherFlapGrad)"
                stroke="#1B4739"
                strokeWidth="1"
              />
              {/* Bordure de couture du rabat */}
              <Path
                d="M 7,16 Q 7,64 22,66 L 152,66 Q 167,64 167,16"
                fill="none"
                stroke="#337863"
                strokeWidth="1.4"
                strokeDasharray="4 3.5"
                opacity="0.75"
              />

              {/* --- D. Bouton pression en laiton doré --- */}
              <G transform="translate(87, 50)">
                {/* Anneau d'ombre sous le fermoir */}
                <Circle cx="0" cy="1" r="14" fill="#061611" opacity="0.6" />
                {/* Anneau extérieur doré */}
                <Circle
                  cx="0"
                  cy="0"
                  r="13"
                  fill="url(#brassClaspGrad)"
                  stroke="#5C3F18"
                  strokeWidth="1.2"
                />
                {/* Trou central du bouton pression */}
                <Circle
                  cx="0"
                  cy="0"
                  r="5"
                  fill="#523916"
                  stroke="#3A270D"
                  strokeWidth="0.8"
                />
                {/* Reflet brillant point lumineux */}
                <Circle cx="-3" cy="-3" r="1.5" fill="#FFFBEB" opacity="0.9" />
              </G>
            </G>
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pedestalWrap: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  walletTransformWrap: {
    position: "absolute",
    top: 10,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-11deg" }],
  },
});
