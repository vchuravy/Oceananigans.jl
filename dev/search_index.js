var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "#Oceananigans.jl-1",
    "page": "Home",
    "title": "Oceananigans.jl",
    "category": "section",
    "text": "Oceananigans is a fast non-hydrostatic ocean model written in Julia that can be run in 2 or 3 dimensions on CPUs and GPUs."
},

{
    "location": "#Installation-instructions-1",
    "page": "Home",
    "title": "Installation instructions",
    "category": "section",
    "text": "Oceananigans is still not an official Julia package. But you can install it using the built-in package manager (accessed by pressing ] in the Julia command prompt)julia>]\n(v1.1) pkg> add https://github.com/ali-ramadhan/Oceananigans.jl.gitNote: We recommend using Julia 1.1 with Oceananigans."
},

{
    "location": "#Running-your-first-model-1",
    "page": "Home",
    "title": "Running your first model",
    "category": "section",
    "text": "Let\'s initialize a 3D ocean with 100times100times50 grid points on a 2times2times1 km domain and simulate it for 10 time steps using steps of 60 seconds each (for a total of 10 minutes of simulation time).using Oceananigans\nNx, Ny, Nz = 100, 100, 50      # Number of grid points in each dimension.\nLx, Ly, Lz = 2000, 2000, 1000  # Domain size (meters).\nNt, Δt = 10, 60                # Number of time steps, time step size (seconds).\n\nmodel = Model((Nx, Ny, Nz), (Lx, Ly, Lz))\ntime_step!(model, Nt, Δt)You just simulated a 3D patch of ocean, it\'s that easy! It was a still lifeless ocean so nothing interesting happened but now you can add interesting dynamics and plot the output."
},

{
    "location": "#CPU-example-1",
    "page": "Home",
    "title": "CPU example",
    "category": "section",
    "text": "Let\'s add something to make the ocean dynamics a bit more interesting."
},

{
    "location": "#GPU-example-1",
    "page": "Home",
    "title": "GPU example",
    "category": "section",
    "text": "If you have access to an Nvidia CUDA-enabled graphics processing unit (GPU) you can run ocean models on it."
},

{
    "location": "examples/#",
    "page": "Examples",
    "title": "Examples",
    "category": "page",
    "text": ""
},

{
    "location": "examples/#Examples-1",
    "page": "Examples",
    "title": "Examples",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#D-models-1",
    "page": "Examples",
    "title": "2D models",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#D-models-2",
    "page": "Examples",
    "title": "1D models",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#Writing-model-output-to-NetCDF-1",
    "page": "Examples",
    "title": "Writing model output to NetCDF",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#Checkpointing-a-model-1",
    "page": "Examples",
    "title": "Checkpointing a model",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#Restarting-a-model-from-a-checkpoint-1",
    "page": "Examples",
    "title": "Restarting a model from a checkpoint",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#Basic-diagnostics-1",
    "page": "Examples",
    "title": "Basic diagnostics",
    "category": "section",
    "text": ""
},

{
    "location": "examples/#Adding-your-own-diagnostics-1",
    "page": "Examples",
    "title": "Adding your own diagnostics",
    "category": "section",
    "text": ""
},

{
    "location": "algorithm/#",
    "page": "Numerical algorithm",
    "title": "Numerical algorithm",
    "category": "page",
    "text": ""
},

{
    "location": "algorithm/#Numerical-algorithm-1",
    "page": "Numerical algorithm",
    "title": "Numerical algorithm",
    "category": "section",
    "text": "Here we present notes on the governing equations, spatial discretization schemes, time-stepping algorithms, and elliptic equation solvers for Oceananigans.jl.  Both hydrostatic (HY) and non-hydrostatic (NHY) algorithms are presented, although the model can only be run in non-hydrostatic mode right now."
},

{
    "location": "algorithm/#Grids-and-variables-1",
    "page": "Numerical algorithm",
    "title": "Grids and variables",
    "category": "section",
    "text": "Lay out a Cartesian array (xyz) of cubes of horizontal dimensions Delta x Delta y and vertical dimension Delta z as in the figure below.  Define the areas of the cell faces as A_x = Delta y Delta z, A_y = Delta x Delta z, and A_z = Delta x Delta y.  Each cell encloses a volume V = Delta x Delta y Delta z.  Velocities (uvw) = (v_x v_y v_z) are normal to the requisite face, that is, they are defined on the faces of the cells.(Image: Schematic of a single volume)  Tracer variables, which are cell averages, are temperature T and salinity S and thus are stored at the cell centers.  Pressure p and density rho are also defined at the cell centers.  The faces of the cells are coincident with three orthogonal coordinate axes (Cartesian in this case).  Vorticity mathbfomega=nablatimesmathbfu and certain intermediate quantities are stored at the cell edges.  (In 2D it would more correct to say the cell corners, however, in 3D variables like vorticity mathbfomega lie  at the same vertical levels as the cell-centered variables and so they really lie at the cell edges.  In addition to being technically correct, we abbreviate cell centers as c and cell faces as f in subscripts, so edges can use e while corners would conflict with cell centers.)The cells are indexed by (ijk) where iin 12dotsN_x, jin 12dotsN_y, and kin 12dotsN_z with k=1 corresponding to the top and k=N_z corresponding to the bottom.  (To solve the equations on the sphere, the \"quads\" used to grid the sphere are appropriately defined including geometrical information and the G\'s in the equations have to be modified slightly to include metric terms.  But the underlying algorithm remains the same.)While there are N cells and cells centers per dimension and N+1 cell faces and cell edges per dimension, all fields are stored as N_x times N_y times N_z fields.  The reason for this is that for the case of periodic boundary conditions, the values at face N+1 equal the values at face 1 so there is no need to store an extra face, and for walled boundaries, faces N+1 and 1 both represent walls so again there is no need to store an extra face. This will change for the case of open boundary conditions which are not considered here."
},

{
    "location": "algorithm/#Governing-prognostic-equations-and-boundary-conditions-1",
    "page": "Numerical algorithm",
    "title": "Governing prognostic equations and boundary conditions",
    "category": "section",
    "text": "The governing equations are the rotating, incompressible, Boussinesq equations of motion.  They are an approximation to the full Navier-Stokes equations in a non-intertial reference frame that is appropriate for the ocean and may be written as:newcommandp2fracpartial 1partial 2\r\nbeginequation\r\n  pmathbfv_ht = mathbfG_vh - nabla_h p\r\n  labeleqnhorizontalMomentum\r\nendequationbeginequation\r\n  pwt = G_w - ppz\r\n  labeleqnverticalMomentum\r\nendequationbeginequation\r\n  nabla cdot mathbfv = 0\r\n  labeleqncontinuity\r\nendequationbeginequation\r\n  pTt = G_T\r\n  labeleqnTTendency\r\nendequationbeginequation\r\n  pSt = G_S\r\n  labeleqnSTendency\r\nendequationbeginequation\r\n  rho = rho(TSp)\r\n  labeleqnEOS\r\nendequationwhere mathbfv = (mathbfv_h w) = (uvw) is the velocity, mathbfv_h = (uv) is the horizontal velocity, nabla = (partial_x partial_y partial_z) is the del operator, and nabla_h = (partial_x partial_y) is the horizontal del operator. Equations \\eqref{eqn:horizontalMomentum} and \\eqref{eqn:verticalMomentum} are the horizontal and vertical momentum equations respectively. Equation \\eqref{eqn:continuity} is the continuity equation expressing conservation of mass. Equations \\eqref{eqn:TTendency} and \\eqref{eqn:STendency} prognostic equations describing the time evolution of temperature T and salinity S. Equation \\eqref{eqn:EOS} is an equation of state for seawater giving the density rho in terms of T, S, and p. The source terms mathbfG_v = (mathbfG_vh G_w) = (G_u G_v G_w) represents inertial, Coriolis, gravitational, forcing, and dissipation terms. They can be written asbeginalign\r\n    G_u = -mathbfv cdot nabla u + fv - frac1rho_0 pp_HYx + nablacdotp (nunabla u) + F_u \r\n    G_v = -mathbfv cdot nabla v - fu - frac1rho_0 pp_HYy + nablacdotp (nunabla v) + F_v \r\n    G_w = -mathbfv cdot nabla w - nablacdotp (nunabla w) + F_w\r\nendalignwhere f = 2Omegasinphi is the Coriolis frequency, Omega is the rotation rate of the Earth, phi is the latitude, g is the acceleration due to gravity, p_HY is the hydrostatic pressure anomaly, rho_0 is a reference density corresponding to an ocean at rest, and nu is the viscosity. F_u, F_v, and F_w represent other forcing terms that may be imposed. Note that the buoyancy term -g(deltarhorho_0) that is usually present in the vertical momentum equation has been expressed in terms of the hydrostatic pressure anomaly p_HY which ends up in the horizontal momentum equations. (This step will be shown in an appendix.)Similarly, the source terms for the tracer quantities can be written asbeginequation\r\n  G_T = -nabla cdot (mathbfv T) + kappanabla^2 T + F_T\r\n  labeleqnG_T\r\nendequationbeginequation\r\n  G_S = -nabla cdot (mathbfv S) + kappanabla^2 S + F_S\r\n  labeleqnG_S\r\nendequationwhere kappa is the diffusivity while F_T and F_S represent forcing terms.The associated boundary conditions for the embedded non-hydrostatic models is periodic in the horizontal direction and a rigid boundary or \"lid\" at the top and bottom. The rigid lid approximation sets w = 0 at the vertical boundaries so that it does not move but still allows a pressure to be exerted on the fluid by the lid."
},

{
    "location": "algorithm/#Numerical-strategy-1",
    "page": "Numerical algorithm",
    "title": "Numerical strategy",
    "category": "section",
    "text": "To numerically solve the governing equations, they must be appropriately discretized. To this effect a number of strategies are employed to ensure the discretized equations satisfy the same conservative properties that the incompressible Navier-Stokes equations satisfy, and to ensure that the numerical solution is stable.The main strategies involve the use of a staggered grid and the splitting of the pressure field into three components."
},

{
    "location": "algorithm/#Staggered-grid-1",
    "page": "Numerical algorithm",
    "title": "Staggered grid",
    "category": "section",
    "text": "As shown in the schematic of a single volume and discussed earlier the velocities are defined as averages over faces while other quantities are cell averages stored at the cell centers. This staggered storage of variables is more complicated than the collocated grid arrangement but is massively beneficial as it avoids the odd-even decoupling between the pressure and velocity if they are stored at the same positions. Odd-even decoupling is a discretization error that can occur on collocated grids and which leads to checkerboard patterns in the solutions (See the CFD Online article on staggered grids). Another way to look at this is that the discrete Poisson equation used to enforce incompressibility has a null space. The null space often manifests itself in producing solutions with checkerboard pressure fields. The staggering of variables effectively eliminates the null space; however, when it is used in the context of curvilinear coordinates its consistent implementation is complicated because it requires the use of contravariant velocity components and variable coordinate base vectors [See A. S. Dvinsky & J. K. Dukowicz, Null-space-free methods for the incompressible Navier-Stokes equations on non-staggered curvilinear grids, Computers & Fluids 22(6), pp. 685–696 (1993)]."
},

{
    "location": "algorithm/#Splitting-of-the-pressure-field-1",
    "page": "Numerical algorithm",
    "title": "Splitting of the pressure field",
    "category": "section",
    "text": "Another strategy employed is to split the pressure field into three componentsbeginequation labeleqnpressure_split\r\n    p(xyz) = p_S(xy) + p_HY(xyz) + qp_NH(xyz)\r\nendequationwhere the first term, p_S, is the surface pressure–-the pressure exerted by the fluid under the rigid lid at the surface; it is only a function of horizontal position and is found by inverting a 2D elliptic Poisson equation. The second term is the hydrostatic pressure p_HY defined in terms of the weight of water in a vertical column above the depth zbeginequation labeleqnhydrostaticPressure\r\n    pp_HYz + g = 0\r\nendequationwhere g = g(delta rho  rho_0) is the reduced gravity. The third term is the non-hydrostatic pressure p_NH which must be found by inverting a 3D elliptic equation analogous to \\eqref{eqn:ellipticPressure}. Note that the parameter q in, for example, \\eqref{eqn:pressure_split}, is a trace parameter that is set to zero in HY and to one in the NHY algorithm. The methods we use to solve for the various components of the pressure field will be described in the next section.A related quantity, the geopotential phi = p  rho_0 is used as required."
},

{
    "location": "algorithm/#Discrete-operators-1",
    "page": "Numerical algorithm",
    "title": "Discrete operators",
    "category": "section",
    "text": "To calculate the various terms and perform the time-stepping, discrete difference and interpolation operators must be designed from which all the terms, such as momentum advection and Laplacian diffusion, may be constructed. These operators introduced in this section are for a Cartesian grid with periodic boundary conditions in the horizontal and a rigid lid at the top and bottom. The operators will change form for other grids such as the cubed sphere."
},

{
    "location": "algorithm/#Difference-operators-1",
    "page": "Numerical algorithm",
    "title": "Difference operators",
    "category": "section",
    "text": "Difference operators act as the discrete form of the derivative operators. Care must be taken when calculating differences as the difference of a cell-centered variable such as temperature T lies on the faces in the direction of the difference, and vice versa. In principle, there are three difference operators, one for each directionbeginequation\r\n  delta_x f = f_E - f_W\r\n  labeleqndelta_x\r\nendequationbeginequation\r\n  delta_y f = f_N - f_S\r\n  labeleqndelta_y\r\nendequationbeginequation\r\n  delta_z f = f_T - f_B\r\n  labeleqndelta_z\r\nendequationwhere the E and W subscripts indicate that the value is evaluated the eastern or western wall of the cell, N and S indicate the northern and southern walls, and T and B indicate the top and bottom walls.Additionally, three delta operators must be defined for each direction to account for the staggered nature of the grid. One for taking the difference of a cell-centered variable and projecting it onto the cell facesbeginalign\r\n    delta_x^c rightarrow f f_ijk = f_ijk - f_i-1jk \r\n    delta_y^c rightarrow f f_ijk = f_ijk - f_ij-1k \r\n    delta_z^c rightarrow f f_ijk = f_ijk - f_ijk-1\r\nendalignand another for taking the difference of a face-centered variable and projecting it onto the cell centersbeginalign\r\n    delta_x^f rightarrow c f_ijk = f_i+1jk - f_ijk \r\n    delta_y^f rightarrow c f_ijk = f_ij+1k - f_ijk \r\n    delta_z^f rightarrow c f_ijk = f_ijk+1 - f_ijk\r\nendalignThe third delta operator of use is the one that takes the difference of an edge-centered variable and projects it onto the cell faces, delta^e rightarrow f, which looks the same as delta^f rightarrow c. While it is computationally redundant, it is included for clarity.The horizontal difference operators, delta_x and delta_y, take into account the periodic boundary conditions while the vertical difference operator delta_z must take into account the rigid lid. In the vertical this is done by imposing that delta_z^c rightarrow ff_ij1 = f_ij1 and delta_z^f rightarrow cf_ijN_z = f_ijN_z."
},

{
    "location": "algorithm/#Interpolation-operators-1",
    "page": "Numerical algorithm",
    "title": "Interpolation operators",
    "category": "section",
    "text": "In order to add or multiply variables that are defined at different points they are interpolated. In our case, linear interpolation or averaging is employed. Once again, there are three averaging operators, one for each direction,beginequation\r\n  overlinef^x = fracf_E + f_W2\r\n  labeleqnavg_x\r\nendequationbeginequation\r\n  overlinef^y = fracf_N + f_S2\r\n  labeleqnavg_y\r\nendequationbeginequation\r\n  overlinef^z = fracf_T + f_B2\r\n  labeleqnavg_z\r\nendequationAdditionally, three averaging operators must be defined for each direction. One for taking the average of a cell-centered variable and projecting it onto the cell facesbeginalign\r\n    overlinef_ijk^xc rightarrow f = fracf_ijk + f_i-1jk2 \r\n    overlinef_ijk^yc rightarrow f = fracf_ijk + f_ij-1k2 \r\n    overlinef_ijk^zc rightarrow f = fracf_ijk + f_ijk-12\r\nendalignand another for taking the average of a face-centered variable and projecting it onto the cell centersbeginalign\r\n    overlinef_ijk^xf rightarrow c = fracf_i+1jk + f_ijk2 \r\n    overlinef_ijk^yf rightarrow c = fracf_ij+1k + f_ijk2 \r\n    overlinef_ijk^zf rightarrow c = fracf_ijk+1 + f_ijk2\r\nendalignThe third averaging operator of use is the one that takes the difference of a face-centered variable and projects it onto the cell edges, overlinef^f rightarrow e, which is the same as delta^c rightarrow f.The horizontal averaging operators take into account the periodic boundary conditions while the vertical averaging operator takes in to account the presence of the rigid lid."
},

{
    "location": "algorithm/#Divergence-and-flux-divergence-operators-1",
    "page": "Numerical algorithm",
    "title": "Divergence and flux divergence operators",
    "category": "section",
    "text": "The divergence of the flux of a cell-centered quantity over the cell can be calculated asbeginequation\r\n    nabla cdot mathbff = frac1V left delta_x^c rightarrow f (A_x f_x)  + delta_y^c rightarrow f (A_y f_y) + delta_z^c rightarrow f (A_z f_z) right\r\nendequationwhere mathbff = (f_x f_y f_z) is the flux with components defined normal to the faces, and V is the volume of the cell. The presence of a solid boundary is indicated by setting the appropriate flux normal to the boundary to zero. In our case, we have already done this in the definition of the delta operators. A similar divergence operator can be defined for a face-centered quantity.The divergence of the flux of T over a cell, nabla cdot (mathbfv T), required in the evaluation of G_T, for example, is thenbeginequation\r\n    nabla cdot (mathbfv T) = frac1V left delta_x^f rightarrow c (A_x u overlineT^x) + delta_y^f rightarrow c (A_y v overlineT^y) + delta_z^f rightarrow c (A_z w overlineT^z) right\r\nendequationwhere T is interpolated onto the cell faces where it can be multiplied by the velocities, which are then differenced and projected onto the cell centers where they added together and then added to G_T which also lives at the cell centers."
},

{
    "location": "algorithm/#Momentum-advection-operators-1",
    "page": "Numerical algorithm",
    "title": "Momentum advection operators",
    "category": "section",
    "text": "The advection terms that make up the mathbfG terms in equations \\eqref{eqn:horizontalMomentum} and \\eqref{eqn:verticalMomentum} can be mathematically written asbeginequation\r\n    mathbfu cdot nabla v\r\n    = nabla cdot (vmathbfu) - vunderbrace(nablacdotmathbfu)_=0\r\n    = nabla cdot (vmathbfu)\r\nendequationwhich can then be discretized similarly to the flux divergence operator, however, they must be discretized differently for each direction.For example, the x-momentum advection operator is discretized asbeginequation\r\n    mathbfu cdot nabla u\r\n    = frac1overlineV^x left\r\n      delta_x^c rightarrow f left( overlineA_x u^x f rightarrow c overlineu^x f rightarrow c right)\r\n      + delta_y^e rightarrow f left( overlineA_y v^x f rightarrow e overlineu^y f rightarrow e right)\r\n      + delta_z^e rightarrow f left( overlineA_z w^x f rightarrow e overlineu^z f rightarrow e right) right\r\nendequationwhere overlineV^x is the average of the volumes of the cells on either side of the face in question. Calculating partial(uu)partial x can be performed by interpolating A_x u and u onto the cell centers then multiplying them and differencing them back onto the faces. However, in the case of the the two other terms, partial(vu)partial y and partial(wu)partial z, the two variables must be interpolated onto the cell edges to be multiplied then differenced back onto the cell faces."
},

{
    "location": "algorithm/#Laplacian-diffusion-operator-1",
    "page": "Numerical algorithm",
    "title": "Laplacian diffusion operator",
    "category": "section",
    "text": "Laplacian diffusion is discretized for tracer quantities asbeginequation\r\n    nabla cdot (kappa nabla T)\r\n    = frac1V left\r\n        delta_x^f rightarrow c left( kappa_h A_x delta_x^c rightarrow f T right)\r\n      + delta_y^f rightarrow c left( kappa_h A_y delta_y^c rightarrow f T right)\r\n      + delta_z^f rightarrow c left( kappa_v A_z delta_z^c rightarrow f T right)\r\n    right\r\nendequationwhere kappa is the diffusivity, usually taken to be the eddy diffusivity, and different diffusivities may be taken for the horizontal and vertical directions to account for the differences between horizontal and vertical turbulence."
},

{
    "location": "algorithm/#Viscous-terms-1",
    "page": "Numerical algorithm",
    "title": "Viscous terms",
    "category": "section",
    "text": "Viscous dissipation operators are discretized similarly to the momentum advection operators and so there is a different one for each direction. For example, the vertical diffusion operator is discretized asbeginmultline\r\n    nabla cdot (nu nabla w)\r\n    = frac1V left\r\n        delta_x^e rightarrow f left( nu_h overlineA_x^xf rightarrow e delta_x^f rightarrow e u right)\r\n        delta_y^e rightarrow f left( nu_h overlineA_y^yf rightarrow e delta_y^f rightarrow e v right) nonumber \r\n        delta_z^c rightarrow f left( nu_v overlineA_z^zf rightarrow c delta_z^f rightarrow c w right)\r\n    right\r\nendmultlinewhere nu is the eddy viscosity.[Need notes on boundary conditions.]"
},

{
    "location": "algorithm/#Time-stepping-1",
    "page": "Numerical algorithm",
    "title": "Time stepping",
    "category": "section",
    "text": "Once the source terms are calculated, the time stepping is performed as follows where superscripts indicate the time-step:beginequation\r\n  fracmathbfu^n+1 - mathbfu^nDelta t = mathbfG_mathbfu^n+12 - nabla (phi_S + phi_HY + qphi_NH)^n+12\r\n  labeleqnvelocity_time_stepping\r\nendequationbeginequation\r\n    frac1Delta t left beginpmatrixS  Tendpmatrix^n+1 - beginpmatrixS  Tendpmatrix^n right = mathbfG^n+12_(ST)\r\n    labeleqnST_time_stepping\r\nendequationThe source terms mathbfG are evaluated using the Adams-Bashforth method (AB2) which makes use of time levels n and n-1:beginequation\r\n    mathbfG^n+12 = left( frac32 + chi right) mathbfG^n - left( frac12 + chi right) mathbfG^n-1\r\nendequationAB2 is a linear extrapolation in time to a point that is just, by an amount chi, on then n+1 side of the midpoint n + 12. AB2 has the advantage of being quasi-second-order in time and yet does not have a computational mode. Furthermore, it can be implemented by evaluating the source terms mathbfG only once and storing them for use on the next time step, thus using less memory that higher-order time stepping schemes such as the popular fourth-order Runge–Kutta method. Typically we set chi = 01."
},

{
    "location": "algorithm/#The-elliptic-problem-for-the-pressure-1",
    "page": "Numerical algorithm",
    "title": "The elliptic problem for the pressure",
    "category": "section",
    "text": "The pressure field is obtained by taking the divergence of \\eqref{eqn:horizontalMomentum} and invoking \\eqref{eqn:verticalMomentum} to yield an elliptic Poisson equation for the geopotential field,beginequation labeleqnellipticPressure\r\n    nabla^2phi = nabla cdot mathbfG_mathbfu = mathscrF\r\nendequationalong with homogenous Neumann boundary conditions mathbfv cdot mathbfhatn = 0 and where mathscrF denotes the right-hand-side or the source term for the Poisson equation.We solve for the pressure field in three steps:Find the 2D surface pressure p_S(xy). \nIntegrate vertically down from the surface to calculate the hydrostatic pressure   field p_HY(xyz) according to \\eqref{eqn:hydrostaticPressure}. \nIn the non-hydrostatic model, we solve for the 3D non-hydrostatic pressure p_NH(xyz). The 3D pressure solve is generally the most computationally expensive operation at each time step. The HY model, however, only involves steps 1 and 2 and is so is much less computationally demanding than NHY.We outline two methods for finding for finding the pressure field. One, the conjugate gradient method, is currently used in the MITgcm. It has the advantage of being versatile, readily supporting different boundary conditions and complicated geometries involving land boundaries. The second, a discrete Fourier-spectral method, can be used in the NHY submodels which employ a regular Cartesian grid with periodic or Neumann boundary conditions."
},

{
    "location": "algorithm/#Conjugate-gradient-method-1",
    "page": "Numerical algorithm",
    "title": "Conjugate-gradient method",
    "category": "section",
    "text": "In the absence of nice boundary conditions (e.g. bathymetry and continental boundaries), a preconditioned conjugate-gradient iterative method is used to solve the 2D and 3D elliptic problems, with the solution of the 2D problem acting as the precondtioner for the 3D problem.We now describe how to solve for the surface pressure p_S(xy). By setting q = 0 in the momentum equations \\eqref{eqn:velocitytimestepping} and summing them over the whole depth of the ocean, invoking the continuity equation \\eqref{eqn:continuity} and applying boundary conditions mathbfv cdot mathbfhatn = 0, the following equation for p_S results:beginequation labeleqnellipticPS\r\n    nabla_h cdot left( H nabla_h phi_S^n+12 right) = mathscrS_HY^n - fracleft nabla_h left( H overlinemathbfv_h^H right) right^nDelta t\r\nendequationwherebeginequation labeleqnS_HY\r\n    mathscrS_HY^n = nabla_h cdot left( H overlinemathbfG_vh^n+12^H right) - nabla_h cdot left( H overlinenabla_h phi_HY^n+12^H right)\r\nendequationHere barcdot^H is the discrete analogue of (1H) int_-H^0 (cdot) dz, a vertical integral over the whole depth of the ocean. The elliptic problem \\eqref{eqn:ellipticPS} and \\eqref{eqn:S_HY} can be written in the concise matrix notationbeginequation\r\n    mathbfA_mathrm2D mathbfphi_S = mathbff_mathrm2D\r\n    quad textwhere quad\r\n    mathbfA_mathrm2D = mathbfD_textdivh cdot H mathbfG_mathrmradh\r\nendequationwhere mathbfA_2D is a symmetric, positive-definite matrix (A2D has five diagonals corresponding to the coupling of the central point with surrounding points along the four arms of the horizontal nabla^2 Operator). composed of mathbfD_textdivh and $ \\mathbf{G}{\\mathrm{rad}\\;h}$ (matrix representations of the div andgrad\'\' operators), \\mathbf{\\phi}S$ is a column vector of surface pressure elements, and mathbff_mathrm2D is a column vector containing the elements of the right-hand side of \\eqref{eqn:ellipticPressure}. The system can thus be solved using a standard conjugate-gradient method, appropriately preconditioned for efficient solution.In non-hydrostatic calculations a three-dimensional elliptic equation must also be inverted for phi_NH(xyz) to ensure that the local divergence vanishes. This is sometimes referred to as a pressure correction. The appropriate discrete form can be deduced in a manner that exactly parallels that which was used to deduce \\eqref{eqn:ellipticPressure}. The resulting elliptic equation can be written asbeginequation\r\n    mathbfA_mathrm3D mathbfphi_NH = mathbff_mathrm3D\r\n    quad textwhere quad\r\n    mathbfA_mathrm3D = mathbfD_textdiv cdot mathbfG_mathrmrad\r\nendequationwhere mathbfA_mathrm3D, like mathbfA_mathrm2D, is a symmetric, positive-definite matrix representing the discrete representation of nabla^2, but now in three dimensions. mathbff_mathrm3D and mathbfphi_NH are (1 times N) column vectors containing the source term and non-hydrostatic pressure, in each of the N = N_xN_yN_z cells into which the ocean has been carved."
},

{
    "location": "algorithm/#Method-based-on-Fourier-transforms-for-regular-domains-1",
    "page": "Numerical algorithm",
    "title": "Method based on Fourier transforms for regular domains",
    "category": "section",
    "text": "On a uniform, orthogonal grid and in the absense of bathymetry, we solve equation \\eqref{eqn:ellipticPressure} using an alternative method described by  Schumann and Sweet (1988). that utilizes an eigenfunction expansion of the discrete Poisson operator on a staggered grid to formulate the solution in terms of the Fast Fourier transform. We note that this is not a \'spectral\' solution method –- it is second-order accurate, and valid for staggered grids, which is critical for eliminating divergence in the velocity  field to machine precision, thereby ensuring conservation of mass. The FFT-based method is adaptable to any boundary condition in any direction and implementable on GPUs.In this eigenfunction-expansion method, the surface and non-hydrostatic pressure are combined into phi_NH+S and solved for simultaneously. An fast discrete transform is used to perform an eignefunction expansion of the source  term mathscrF, where the type of discrete transform (Fourier, Cosine, or Sine) depends on the  eigenfunctions of the Poisson equation, and thus the boundary conditions (Periodic, Neumann, and Dirichlet). At the moment we only provide a solver for Periodic, Periodic, Neumann boundary conditions in x, y, and z.The amplitudes of each eigenfunction component hat phi_NH+S of the solution phi_NH+S are then easily found by  inverting the matrix equationbeginequation labeleqneigenpressure\r\nleft ( lambda^x_i lambda^y_j lambda^z_k right ) hat phi_NH+S_ijk = hat mathscrF \r\nendequationwhere the lambda^x_i lambda^y_j lambda^z_k are the eigenvalues of the Poisson equation: beginalign\r\n    lambda^x_i = 4fracN_x^2L_x^2 sin^2 left frac(i-1)piN_x right  quad i=12 dotsN_x-1 \r\n    lambda^x_j = 4fracN_y^2L_y^2 sin^2 left frac(j-1)piN_y right  quad j=12 dotsN_y-1 \r\n    lambda^x_k = 4fracN_z^2L_z^2 sin^2 left frac(k-1)pi2N_z right quad k=12 dotsN_z-1\r\nendalignAfter solving \\eqref{eqn:eigenpressure}, the final step is to reconstruct the physical solution  phi_NH+S from its eigenfunction expansion hat phi_NH+S_ijk with an inverse discrete transform.  The total cost of solving Poisson\'s equation with an eigenfunction expansions and FFTs is mathcalO(Nlog N) , compared to mathcalO(N^2) operations for the conjugate-gradient solver, where N = N_xN_yN_z. "
},

{
    "location": "internal/grids/#",
    "page": "Grids",
    "title": "Grids",
    "category": "page",
    "text": ""
},

{
    "location": "internal/grids/#Oceananigans.RegularCartesianGrid",
    "page": "Grids",
    "title": "Oceananigans.RegularCartesianGrid",
    "category": "type",
    "text": "RegularCartesianGrid\n\nA Cartesian grid with regularly spaces cells and faces so that Δx, Δy, and Δz are constants. Fields are stored using floating-point values of type T.\n\n\n\n\n\n"
},

{
    "location": "internal/grids/#Oceananigans.RegularCartesianGrid-Tuple{ModelMetadata,Any,Any}",
    "page": "Grids",
    "title": "Oceananigans.RegularCartesianGrid",
    "category": "method",
    "text": "RegularCartesianGrid(metadata::ModelMetadata, N, L)\n\nCreate a regular Cartesian grid with size N = (N_x N_y N_z) and domain size L = (L_x L_y L_z) where fields are stored using floating-point values of type T.\n\nExamples\n\njulia> g = RegularCartesianGrid((16, 16, 8), (2π, 2π, 2π))\n\n\n\n\n\n"
},

{
    "location": "internal/grids/#Grids-1",
    "page": "Grids",
    "title": "Grids",
    "category": "section",
    "text": "RegularCartesianGrid\r\nRegularCartesianGrid(metadata::ModelMetadata, N, L)"
},

{
    "location": "internal/fields/#",
    "page": "Fields",
    "title": "Fields",
    "category": "page",
    "text": ""
},

{
    "location": "internal/fields/#Oceananigans.CellField",
    "page": "Fields",
    "title": "Oceananigans.CellField",
    "category": "type",
    "text": "CellField{T,G<:Grid{T}} <: Field\n\nA cell-centered field defined on a grid G whose values are stored as floating-point values of type T.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldX",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldX",
    "category": "type",
    "text": "FaceFieldX{T,G<:Grid{T}} <: FaceField{G}\n\nAn x-face-centered field defined on a grid G whose values are stored as floating-point values of type T.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldY",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldY",
    "category": "type",
    "text": "FaceFieldY{T,G<:Grid{T}} <: FaceField{G}\n\nA y-face-centered field defined on a grid G whose values are stored as floating-point values of type T.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldZ",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldZ",
    "category": "type",
    "text": "FaceFieldZ{T,G<:Grid{T}} <: FaceField{G}\n\nA z-face-centered field defined on a grid G whose values are stored as floating-point values of type T.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.EdgeField",
    "page": "Fields",
    "title": "Oceananigans.EdgeField",
    "category": "type",
    "text": "EdgeField{T<:AbstractArray} <: Field\n\nA field defined on a grid G whose values lie on the edges of the cells.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.CellField-Tuple{ModelMetadata,Grid,Any}",
    "page": "Fields",
    "title": "Oceananigans.CellField",
    "category": "method",
    "text": "CellField(metadata::ModelMetadata, grid::Grid, T)\n\nConstruct a CellField whose values are defined at the center of a cell.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldX-Tuple{ModelMetadata,Grid,Any}",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldX",
    "category": "method",
    "text": "FaceFieldX(metadata::ModelMetadata, grid::Grid, T)\n\nA Field whose values are defined on the x-face of a cell.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldY-Tuple{ModelMetadata,Grid,Any}",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldY",
    "category": "method",
    "text": "FaceFieldY(metadata::ModelMetadata, grid::Grid, T)\n\nA Field whose values are defined on the y-face of a cell.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.FaceFieldZ-Tuple{ModelMetadata,Grid,Any}",
    "page": "Fields",
    "title": "Oceananigans.FaceFieldZ",
    "category": "method",
    "text": "FaceFieldZ(metadata::ModelMetadata, grid::Grid, T)\n\nA Field whose values are defined on the z-face of a cell.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Oceananigans.EdgeField-Tuple{ModelMetadata,Grid,Any}",
    "page": "Fields",
    "title": "Oceananigans.EdgeField",
    "category": "method",
    "text": "FEdgeField(metadata::ModelMetadata, grid::Grid, T)\n\nA Field whose values are defined on the edges of a cell.\n\n\n\n\n\n"
},

{
    "location": "internal/fields/#Fields-1",
    "page": "Fields",
    "title": "Fields",
    "category": "section",
    "text": "CellField\r\nFaceFieldX\r\nFaceFieldY\r\nFaceFieldZ\r\nEdgeField\r\nCellField(metadata::ModelMetadata, grid::Grid, T)\r\nFaceFieldX(metadata::ModelMetadata, grid::Grid, T)\r\nFaceFieldY(metadata::ModelMetadata, grid::Grid, T)\r\nFaceFieldZ(metadata::ModelMetadata, grid::Grid, T)\r\nEdgeField(metadata::ModelMetadata, grid::Grid, T)"
},

{
    "location": "internal/operators/#",
    "page": "Operators",
    "title": "Operators",
    "category": "page",
    "text": ""
},

{
    "location": "internal/operators/#Operators-1",
    "page": "Operators",
    "title": "Operators",
    "category": "section",
    "text": ""
},

{
    "location": "internal/operators/#Difference-operators-1",
    "page": "Operators",
    "title": "Difference operators",
    "category": "section",
    "text": "δx!(g::RegularCartesianGrid, f::CellField, δxf::FaceField)\r\nδx!(g::RegularCartesianGrid, f::FaceField, δxf::CellField)\r\nδy!(g::RegularCartesianGrid, f::CellField, δyf::FaceField)\r\nδy!(g::RegularCartesianGrid, f::FaceField, δyf::CellField)\r\nδz!(g::RegularCartesianGrid, f::CellField, δzf::FaceField)\r\nδz!(g::RegularCartesianGrid, f::FaceField, δzf::CellField)"
},

{
    "location": "internal/operators/#Averaging-operators-1",
    "page": "Operators",
    "title": "Averaging operators",
    "category": "section",
    "text": "avgx!(g::RegularCartesianGrid, f::CellField, favgx::FaceField)"
},

{
    "location": "internal/operators/#Divergence-operators-1",
    "page": "Operators",
    "title": "Divergence operators",
    "category": "section",
    "text": "Building on top of the differencing operators we can define operators that compute the divergencenablacdotpmathbff = frac1V left delta_x left( A_x f_x right)\r\n+ delta_yleft( A_y f_y right) + delta_zleft( A_z f_z right)rightdiv!(g::RegularCartesianGrid, fx::FaceFieldX, fy::FaceFieldY, fz::FaceFieldZ, div::CellField, tmp::OperatorTemporaryFields)"
},

{
    "location": "subject_index/#",
    "page": "Index",
    "title": "Index",
    "category": "page",
    "text": ""
},

{
    "location": "subject_index/#Index-1",
    "page": "Index",
    "title": "Index",
    "category": "section",
    "text": ""
},

]}
