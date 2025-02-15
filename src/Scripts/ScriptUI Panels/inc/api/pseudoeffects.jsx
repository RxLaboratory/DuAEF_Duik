#include "../pe/pe_bone.ffx.jsxinc"
#include "../pe/pe_bone_envelop.ffx.jsxinc"
#include "../pe/pe_pin.ffx.jsxinc"
#include "../pe/pe_pathPin.ffx.jsxinc"
#include "../pe/pe_posPin.ffx.jsxinc"
#include "../pe/pe_controller.ffx.jsxinc"
#include "../pe/pe_controller_slider.ffx.jsxinc"
#include "../pe/pe_controller_2dslider.ffx.jsxinc"
#include "../pe/pe_controller_angle.ffx.jsxinc"
#include "../pe/pe_1d_list.ffx.jsxinc"
#include "../pe/pe_2d_list.ffx.jsxinc"
#include "../pe/pe_3d_list.ffx.jsxinc"
#include "../pe/pe_color_list.ffx.jsxinc"
#include "../pe/pe_2dimensions.ffx.jsxinc"
#include "../pe/pe_2dimensions_angle.ffx.jsxinc"
#include "../pe/pe_2dimensions_scale.ffx.jsxinc"
#include "../pe/pe_3dimensions.ffx.jsxinc"
#include "../pe/pe_3dimensions_angle.ffx.jsxinc"
#include "../pe/pe_3dimensions_scale.ffx.jsxinc"
#include "../pe/pe_color.ffx.jsxinc"
#include "../pe/pe_expose_transform.ffx.jsxinc"
#include "../pe/pe_key_morph.ffx.jsxinc"
#include "../pe/pe_key_morph_k.ffx.jsxinc"
#include "../pe/pe_1layer_ik.ffx.jsxinc"
#include "../pe/pe_2layer_ik.ffx.jsxinc"
#include "../pe/pe_bezier_ik.ffx.jsxinc"
#include "../pe/pe_bezier_ik_curve.ffx.jsxinc"
#include "../pe/pe_bezier_ik_layer.ffx.jsxinc"
#include "../pe/pe_fk.ffx.jsxinc"
#include "../pe/pe_parent.ffx.jsxinc"
#include "../pe/pe_position.ffx.jsxinc"
#include "../pe/pe_orientation.ffx.jsxinc"
#include "../pe/pe_path.ffx.jsxinc"
#include "../pe/pe_footRoll.ffx.jsxinc"
#include "../pe/pe_digi_footRoll.ffx.jsxinc"
#include "../pe/pe_shoulder.ffx.jsxinc"
#include "../pe/pe_fin.ffx.jsxinc"
#include "../pe/pe_looper.ffx.jsxinc"
#include "../pe/pe_interpolator.ffx.jsxinc"
#include "../pe/pe_2d_camera.ffx.jsxinc"
#include "../pe/pe_camera_behaviour.ffx.jsxinc"
#include "../pe/pe_1d_connector.ffx.jsxinc"
#include "../pe/pe_2d_connector.ffx.jsxinc"
#include "../pe/pe_3d_connector.ffx.jsxinc"
#include "../pe/pe_color_connector.ffx.jsxinc"
#include "../pe/pe_effector.ffx.jsxinc"
#include "../pe/pe_effector_map.ffx.jsxinc"
#include "../pe/pe_audio_connector.ffx.jsxinc"
#include "../pe/pe_quick_connector.ffx.jsxinc"
#include "../pe/pe_kleaner.ffx.jsxinc"
#include "../pe/pe_1d_swink.ffx.jsxinc"
#include "../pe/pe_2d_swink.ffx.jsxinc"
#include "../pe/pe_3d_swink.ffx.jsxinc"
#include "../pe/pe_color_swink.ffx.jsxinc"
#include "../pe/pe_1d_wiggle.ffx.jsxinc"
#include "../pe/pe_2d_wiggle.ffx.jsxinc"
#include "../pe/pe_3d_wiggle.ffx.jsxinc"
#include "../pe/pe_multi_wiggle.ffx.jsxinc"
#include "../pe/pe_wheel.ffx.jsxinc"
#include "../pe/pe_1d_random.ffx.jsxinc"
#include "../pe/pe_2d_random.ffx.jsxinc"
#include "../pe/pe_3d_random.ffx.jsxinc"
#include "../pe/pe_multi_random.ffx.jsxinc"
#include "../pe/pe_motion_trail.ffx.jsxinc"
#include "../pe/pe_paint_rig.ffx.jsxinc"
#include "../pe/pe_xsheet.ffx.jsxinc"
#include "../pe/pe_wing.ffx.jsxinc"
#include "../pe/pe_feather.ffx.jsxinc"
#include "../pe/pe_bone_data.ffx.jsxinc"
#include "../pe/pe_bone_data_light.ffx.jsxinc"
#include "../pe/pe_bone_noodle.ffx.jsxinc"
#include "../pe/pe_color_wiggle.ffx.jsxinc"

/**
* The pseudo effects used by Duik.
* @enum {DuAEPseudoEffect}
*/
Duik.PseudoEffect = {
    BONE: new DuAEPseudoEffect(pe_bone),
    BONE_ENVELOP: new DuAEPseudoEffect(pe_bone_envelop),
    PIN: new DuAEPseudoEffect(pe_pin),
    PATH_PIN: new DuAEPseudoEffect(pe_pathPin),
    POS_PIN: new DuAEPseudoEffect(pe_posPin),
    CONTROLLER: new DuAEPseudoEffect(pe_controller),
    CONTROLLER_SLIDER: new DuAEPseudoEffect(pe_controller_slider),
    CONTROLLER_2DSLIDER: new DuAEPseudoEffect(pe_controller_2dslider),
    CONTROLLER_ANGLE: new DuAEPseudoEffect(pe_controller_angle),
    ONED_LIST: new DuAEPseudoEffect(pe_1d_list),
    TWOD_LIST: new DuAEPseudoEffect(pe_2d_list),
    THREED_LIST: new DuAEPseudoEffect(pe_3d_list),
    COLOR_LIST: new DuAEPseudoEffect(pe_color_list),
    THREE_DIMENSIONS_SCALE: new DuAEPseudoEffect(pe_3dimensions_scale),
    THREE_DIMENSIONS_ANGLE: new DuAEPseudoEffect(pe_3dimensions_angle),
    THREE_DIMENSIONS: new DuAEPseudoEffect(pe_3dimensions),
    TWO_DIMENSIONS_SCALE: new DuAEPseudoEffect(pe_2dimensions_scale),
    TWO_DIMENSIONS_ANGLE: new DuAEPseudoEffect(pe_2dimensions_angle),
    TWO_DIMENSIONS: new DuAEPseudoEffect(pe_2dimensions),
    COLOR: new DuAEPseudoEffect(pe_color),
    EXPOSE_TRANSFORM: new DuAEPseudoEffect(pe_expose_transform),
    KEY_MORPH: new DuAEPseudoEffect(pe_key_morph),
    KEY_MORPH_K: new DuAEPseudoEffect(pe_key_morph_k),
    ONE_LAYER_IK: new DuAEPseudoEffect(pe_1layer_ik),
    TWO_LAYER_IK: new DuAEPseudoEffect(pe_2layer_ik),
    BEZIER_IK: new DuAEPseudoEffect(pe_bezier_ik),
    BEZIER_IK_CURVE: new DuAEPseudoEffect(pe_bezier_ik_curve),
    BEZIER_IK_LAYER: new DuAEPseudoEffect(pe_bezier_ik_layer),
    FK: new DuAEPseudoEffect(pe_fk),
    PARENT: new DuAEPseudoEffect(pe_parent),
    POSITION: new DuAEPseudoEffect(pe_position),
    ORIENTATION: new DuAEPseudoEffect(pe_orientation),
    PATH: new DuAEPseudoEffect(pe_path),
    FOOT_ROLL: new DuAEPseudoEffect(pe_footRoll),
    DIGI_FOOT_ROLL: new DuAEPseudoEffect(pe_digi_footRoll),
    SHOULDER: new DuAEPseudoEffect(pe_shoulder),
    FIN: new DuAEPseudoEffect(pe_fin),
    LOOPER: new DuAEPseudoEffect(pe_looper),
    INTERPOLATOR: new DuAEPseudoEffect(pe_interpolator),
    TWO_D_CAMERA: new DuAEPseudoEffect(pe_2d_camera),
    CAMERA_BEHAVIOUR: new DuAEPseudoEffect(pe_camera_behaviour),
    ONED_CONNECTOR: new DuAEPseudoEffect(pe_1d_connector),
    TWOD_CONNECTOR: new DuAEPseudoEffect(pe_2d_connector),
    THREED_CONNECTOR: new DuAEPseudoEffect(pe_3d_connector),
    COLOR_CONNECTOR: new DuAEPseudoEffect(pe_color_connector),
    EFFECTOR: new DuAEPseudoEffect(pe_effector),
    EFFECTOR_MAP: new DuAEPseudoEffect(pe_effector_map),
    AUDIO_CONNECTOR: new DuAEPseudoEffect(pe_audio_connector),
    QUICK_CONNECTOR: new DuAEPseudoEffect(pe_quick_connector),
    KLEANER: new DuAEPseudoEffect(pe_kleaner),
    ONED_SWINK: new DuAEPseudoEffect(pe_1d_swink),
    TWOD_SWINK: new DuAEPseudoEffect(pe_2d_swink),
    THREED_SWINK: new DuAEPseudoEffect(pe_3d_swink),
    COLOR_SWINK: new DuAEPseudoEffect(pe_color_swink),
    ONED_WIGGLE: new DuAEPseudoEffect(pe_1d_wiggle),
    TWOD_WIGGLE: new DuAEPseudoEffect(pe_2d_wiggle),
    THREED_WIGGLE: new DuAEPseudoEffect(pe_3d_wiggle),
    MULTI_WIGGLE: new DuAEPseudoEffect(pe_multi_wiggle),
    COLOR_WIGGLE: new DuAEPseudoEffect(pe_color_wiggle),
    WHEEL: new DuAEPseudoEffect(pe_wheel),
    ONED_RANDOM: new DuAEPseudoEffect(pe_1d_random),
    TWOD_RANDOM: new DuAEPseudoEffect(pe_2d_random),
    THREED_RANDOM: new DuAEPseudoEffect(pe_3d_random),
    MULTI_RANDOM: new DuAEPseudoEffect(pe_multi_random),
    MOTION_TRAIL: new DuAEPseudoEffect(pe_motion_trail),
    PAINT_RIG: new DuAEPseudoEffect(pe_paint_rig),
    X_SHEET: new DuAEPseudoEffect(pe_xsheet),
    WING: new DuAEPseudoEffect(pe_wing),
    FEATHER: new DuAEPseudoEffect(pe_feather),
    BONE_DATA: new DuAEPseudoEffect(pe_bone_data),
    BONE_DATA_LIGHT: new DuAEPseudoEffect(pe_bone_data_light),
    BONE_NOODLE: new DuAEPseudoEffect(pe_bone_noodle),
};
