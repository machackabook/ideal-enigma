(* GAIA–NEXUS / Mathematica EDMD patch v1.0.
   Load after defining the user's AdvancedLiftDictionary[x_List, config_Association].
   The input must be consecutive measured/analytic states, not NN output labels.
   Not executed here: no Wolfram kernel is installed in the verification host. *)

ClearAll[ComputeKoopmanDynamics, KoopmanOneStepLift];

ComputeKoopmanDynamics[states_List, config_Association] := Module[
  {px, py, u, s, v, sigma, total, cumulative, energy,
   rank, hardLimit, lambda, damping, k, targets, positions},

  If[Length[states] < 3, Return[Failure["InsufficientStates", <||>]]];
  px = N[AdvancedLiftDictionary[#, config] & /@ Most[states]];
  py = N[AdvancedLiftDictionary[#, config] & /@ Rest[states]];
  If[Dimensions[px] =!= Dimensions[py],
    Return[Failure["BasisDimensions", <|"X" -> Dimensions[px],
      "Y" -> Dimensions[py]|>]]
  ];

  {u, s, v} = SingularValueDecomposition[px];
  sigma = Diagonal[s];
  total = Total[sigma^2];
  If[!NumericQ[total] || total <= 0,
    Return[Failure["DegenerateSingularValues", <||>]]
  ];

  energy = Clip[N@Lookup[config, "EnergyThreshold", 0.999], {0.0, 1.0}];
  cumulative = Accumulate[sigma^2]/total;
  positions = FirstPosition[cumulative, _?(# >= energy &), {Length[sigma]}];
  hardLimit = Max[1, Round@Lookup[config, "HardRankLimit", 85]];
  rank = Max[1, Min[positions[[1]], hardLimit, Length[sigma]]];
  lambda = N@Lookup[config, "RidgeParameter", 1.*^-6];
  If[lambda <= 0, Return[Failure["InvalidRidge", <||>]]];

  (* Correct Tikhonov damping; not a hard inverse 1/sigma cutoff. *)
  damping = sigma[[1 ;; rank]]/(sigma[[1 ;; rank]]^2 + lambda);
  k = v[[All, 1 ;; rank]] . DiagonalMatrix[damping] .
      ConjugateTranspose[u[[All, 1 ;; rank]]] . py;

  <|
    "Operator" -> k,
    "Rank" -> rank,
    "LiftedDimension" -> Dimensions[px][[2]],
    "EnergyRetained" -> cumulative[[rank]],
    "RidgeParameter" -> lambda,
    "DynamicsEquation" -> "Psi(X) . K ~= Psi(Y)"
  |>
];

KoopmanOneStepLift[liftedState_List, fitted_Association] :=
  liftedState . fitted["Operator"];
