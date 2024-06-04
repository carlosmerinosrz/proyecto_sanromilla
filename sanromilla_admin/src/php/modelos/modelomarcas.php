<?php
require_once('config/configdb.php');
require_once '../vendor/autoload.php'; // Asegúrate de haber instalado PHPSpreadsheet

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


/**
 * Clase Modelo de Marcas
 */
class ModeloMarcas{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;

    function __construct()
    {
        $this->servidor = constant('SERVIDOR');
        $this->usuario = constant('USUARIO');
        $this->contrasenia = constant('CONTRASENIA');
        $this->bd = constant('BD');

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['token'])) {
            header('Location: ../../../');
            exit;
        }
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {
        $this->conexion = new mysqli($this->servidor, $this->
        usuario, $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }

    /**
     * Enviar datos de la carrera
     * @param array $raceData Datos de la carrera
     * @return int 1 si se insertó correctamente, 0 si falló la inserción
     */
    
     public function enviarDatosCarrera($raceData){

        $this->conectar();
        $participants = $raceData['participants'];
        $category = $raceData['category'];
        
        try {
            foreach ($participants as $participant) {
                $time = $participant['time'];
                $ritmo = $participant['ritmo'];
                $consulta = $this->conexion->prepare("INSERT INTO clasificaciones (tiempo, ritmo, id_categoria) VALUES (?, ?, ?)");
                $consulta->bind_param("ssi", $time, $ritmo, $category);
                $resultado = $consulta->execute();
                if (!$resultado) {
                    return 0; // Falló la inserción
                }
            }
            return 1; // Éxito en la inserción de datos de carrera
        } catch (Exception $e) {
            return $e; // Captura de excepciones
        } finally {
            $consulta->close();
            $this->conexion->close();
        }
    }

    public function comprobarCategoria($id_categoria) {
        $this->conectar();
    
        $datos = 0;

        $query = "SELECT id_categoria FROM clasificaciones WHERE id_categoria = ?";

        $consulta = $this->conexion->prepare($query);
        $consulta->bind_param("i", $id_categoria);
        $consulta->execute();
    
        $resultado = $consulta->get_result();
    
        if ($resultado->num_rows > 0) {
            $datos = 1;
        }
    
        $consulta->close();
        $this->conexion->close();
    
        return $datos;
    }

    public function exportarExcel($id_categoria)
    {
        $this->conectar();
    
        $query = "SELECT c.nombre, cl.id_clasificacion, cl.id_inscripcion, cl.tiempo, cl.ritmo, cl.id_categoria, cl.masculino, cl.femenino, cl.general
                  FROM clasificaciones cl
                  INNER JOIN categorias c ON cl.id_categoria = c.id_categoria
                  WHERE cl.id_categoria = ?
                  ORDER BY cl.tiempo ASC";
    
        $consulta = $this->conexion->prepare($query);
        $consulta->bind_param("i", $id_categoria);
        $consulta->execute();
    
        $resultado = $consulta->get_result();
    
        $participantes = array();
        $clasificacion = 1;
    
        if ($resultado->num_rows > 0) {
            while ($row = $resultado->fetch_assoc()) {
                $participantes[] = array(
                    'id_clasificacion' => $clasificacion,
                    'id_inscripcion' => $row['id_inscripcion'],
                    'tiempo' => $row['tiempo'],
                    'ritmo' => $row['ritmo'],
                    'id_categoria' => $row['id_categoria'],
                    'nombre_categoria' => $row['nombre'],
                    'masculino' => $row['masculino'],
                    'femenino' => $row['femenino'],
                    'general' => $row['general'],
                );
                $clasificacion++;
            }
        }
    
        $consulta->close();
        $this->conexion->close();
    
        // Crear el libro de Excel
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
    
        // Establecer el nombre de la categoría en una fila que ocupe todas las columnas
        $sheet->mergeCells('A1:H1');
        $sheet->setCellValue('A1', $participantes[0]['nombre_categoria']);
        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('4b4b4b4b');
        $sheet->getStyle('A1')->getFont()->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE);
    
        // Establecer los encabezados
        $sheet->setCellValue('A2', 'Clasificación');
        $sheet->setCellValue('B2', 'id_inscripcion');
        $sheet->setCellValue('C2', 'Tiempo de Llegada');
        $sheet->setCellValue('D2', 'Ritmo (km/min)');
        $sheet->setCellValue('E2', 'masculino');
        $sheet->setCellValue('F2', 'femenino');
        $sheet->setCellValue('G2', 'general');
    
        // Aplicar estilo a los encabezados
        $sheet->getStyle('A2:H2')->getFont()->setBold(true);
        $sheet->getStyle('A2:H2')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF808080');
        $sheet->getStyle('A2:H2')->getFont()->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE);
    
        // Agregar los datos de los participantes
        $row = 3;
        foreach ($participantes as $participante) {
            $sheet->setCellValue('A' . $row, $participante['id_clasificacion']);
            $sheet->setCellValue('B' . $row, $participante['id_inscripcion']);
            $sheet->setCellValue('C' . $row, $participante['tiempo']);
            $sheet->setCellValue('D' . $row, $participante['ritmo']);
            $sheet->setCellValue('E' . $row, $participante['masculino']);
            $sheet->setCellValue('F' . $row, $participante['femenino']);
            $sheet->setCellValue('G' . $row, $participante['general']);
    
            // Aplicar estilo a las filas de datos
            $sheet->getStyle('A' . $row . ':H' . $row)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFFFF');
            $sheet->getStyle('A' . $row . ':H' . $row)->getFont()->getColor()->setARGB('FF000000');
    
            $row++;
        }
    
        // Generar y guardar el archivo Excel
        $writer = new Xlsx($spreadsheet);
        $fileName = 'Marcas - Categoria ' . mb_convert_encoding($participantes[0]['nombre_categoria'], 'UTF-8', 'UTF-8') . '.xlsx';
        $ruta_destino = '../../assets/clasificacion/';

        $fullFilePath = $ruta_destino . $fileName;
        $writer->save($fullFilePath);

        // Abrir el archivo Excel con el programa predeterminado
        return $fileName;

        
    }
    
}
