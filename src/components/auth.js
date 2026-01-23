export const isAuthenticated = () =>{
    return !!localStorage.getItem("userRole");
};
export const login =(role) =>{
    localStorage.setItem("userRole",role)
};
export const logout = ()=>{
    localStorage.removeItem("userRole")
}
