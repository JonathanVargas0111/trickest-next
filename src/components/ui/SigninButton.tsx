'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SkateProfileCompletionModal from "../sections/SkateProfileCompletionModal";

const SigninButton = () => {
  const pathname = usePathname();
  if (pathname !== "/") return null; // Oculta el botón en otras páginas

  const { data: session } = useSession();
  const [openModal, setModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const handleModal = () => setModal(!openModal);
  const handleVideoModal = () => setOpenVideoModal(!openVideoModal);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/skate_profiles?email=${session.user.email}`);
          const data = await response.json();
          if (data.registered) setIsRegistered(true);
        } catch (error) {
          console.error("Error verificando registro:", error);
        }
      }
    };
    checkUserRegistration();
  }, [session]);

  return (
    <>
      {/* Botón "Cómo jugar" (Siempre visible en el home) */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleVideoModal}
          className="px-6 py-3 text-lg font-bold text-white bg-blue-600 border-4 border-white rounded-lg shadow-lg hover:scale-110 transition-transform duration-300"
        >
          Cómo jugar
        </button>
      </div>

      {/* Botones principales para usuarios registrados y no registrados */}
      {session?.user ? (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center gap-4 z-50">
          {isRegistered ? (
            <Link href="/dashboard/skaters/profile">
              <button className="px-6 py-3 text-lg font-bold text-white bg-green-600 border-4 border-white rounded-lg shadow-lg hover:scale-110 transition-transform duration-300">
                Ver Perfil
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="px-6 py-3 text-lg font-bold text-white bg-green-600 border-4 border-white rounded-lg shadow-lg hover:scale-110 transition-transform duration-300"
              onClick={handleModal}
            >
              Completar registro
            </button>
          )}

          {/* Nombre del usuario */}
          <p className="text-lg font-semibold text-white bg-black px-4 py-2 rounded-lg">
            {session.user.name}
          </p>

          {/* Botón de cerrar sesión */}
          <button
            onClick={() => signOut()}
            className="px-6 py-3 text-lg font-bold text-white bg-red-600 border-4 border-white rounded-lg shadow-lg hover:scale-110 transition-transform duration-300"
          >
            Salir
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="fixed left-1/2 bottom-10 transform -translate-x-1/2 bg-green-600 text-white font-bold px-6 py-3 text-lg rounded-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300"
        >
          Jugar
        </button>
      )}

      {/* Modal para completar el registro */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[9999]">
          <div className="w-[90%] max-w-lg bg-white p-6 rounded-lg shadow-xl relative">
            {/* Botón de cerrar */}
            <button
              onClick={handleModal}
              className="absolute top-3 right-3 text-gray-700 font-bold text-2xl"
            >
              ✖
            </button>

            {/* Contenido del modal */}
            <h2 className="text-xl font-bold text-center mb-4">Completa tu Registro</h2>

            <SkateProfileCompletionModal openModal={openModal} handleModal={handleModal} />
          </div>
        </div>
      )}
      {/* Modal para el video */}
      {openVideoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              onClick={handleVideoModal}
              className="absolute top-2 right-2 text-red-600 font-bold text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Cómo jugar</h2>
            <div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
              <video
                className="w-full rounded-lg"
                src="/demo.mp4"
                autoPlay
                controls
                onEnded={handleVideoModal} // Cierra el modal cuando termina (opcional)
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SigninButton;

